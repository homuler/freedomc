module Foundation where

import Prelude
import Yesod
import Yesod.Static
import Yesod.Auth
import Yesod.Auth.BrowserId
import Yesod.Auth.GoogleEmail
import Yesod.Default.Config
import Yesod.Default.Util (addStaticContentExternal)
import Network.HTTP.Client.Conduit (Manager, HasHttpManager (getHttpManager))
import qualified Settings
import Settings.Development (development)
import qualified Database.Persist
import Database.Persist.Sql (SqlPersistT)
import Settings.StaticFiles
import Settings (widgetFile, Extra (..))
import Model
import Text.Jasmine (minifym)
import Text.Hamlet (hamletFile)
import Yesod.Core.Types (Logger)
import Data.Text
import FC.Persistent

-- | The site argument for your application. This can be a good place to
-- keep settings and values requiring initialization before your application
-- starts running, such as database connections. Every handler will have
-- access to the data present here.
data App = App
    { settings :: AppConfig DefaultEnv Extra
    , getStatic :: Static -- ^ Settings for static file serving.
    , connPool :: Database.Persist.PersistConfigPool Settings.PersistConf -- ^ Database connection pool.
    , httpManager :: Manager
    , persistConfig :: Settings.PersistConf
    , appLogger :: Logger
    }

instance HasHttpManager App where
    getHttpManager = httpManager

-- Set up i18n messages. See the message folder.
mkMessage "App" "messages" "en"

-- This is where we define all of the routes in our application. For a full
-- explanation of the syntax, please see:
-- http://www.yesodweb.com/book/routing-and-handlers
--
-- Note that this is really half the story; in Application.hs, mkYesodDispatch
-- generates the rest of the code. Please see the linked documentation for an
-- explanation for this split.
mkYesodData "App" $(parseRoutesFile "config/routes")

type Form x = Html -> MForm (HandlerT App IO) (FormResult x, Widget)

-- Please see the documentation for the Yesod typeclass. There are a number
-- of settings which can be configured by overriding methods here.
instance Yesod App where
    approot = ApprootMaster $ appRoot . settings

    -- Store session data on the client in encrypted cookies,
    -- default session idle timeout is 120 minutes
    makeSessionBackend _ = fmap Just $ defaultClientSessionBackend
        120    -- timeout in minutes
        "config/client_session_key.aes"
    defaultLayout widget = do
      master <- getYesod
      mmsg <- getMessage
      mUserId <- maybeAuthId
      pc <- widgetToPageContent $ do
          $(combineStylesheets 'StaticR
              [ css_normalize_css
              , css_bootstrap_min_css
              ])
          $(widgetFile "default-layout")
      navbar <- widgetToPageContent $ do
          $(widgetFile "default-navbar")
      giveUrlRenderer $(hamletFile "templates/default-layout-wrapper.hamlet")


    -- This is done to provide an optimization for serving static files from
    -- a separate domain. Please see the staticRoot setting in Settings.hs
    urlRenderOverride y (StaticR s) =
        Just $ uncurry (joinPath y (Settings.staticRoot $ settings y)) $ renderRoute s
    urlRenderOverride _ _ = Nothing

    -- The page to be redirected to when authentication is required.
    authRoute _ = Just $ AuthR LoginR

    isAuthorized FCHomeR _ = isLoggedIn
    isAuthorized FCTypingR _ = isLoggedIn
    isAuthorized FCMusicRegisterR _ = isLoggedIn
    isAuthorized (FCMusicEditorR _) _ = isLoggedIn
    isAuthorized _ _ = return Authorized

    -- This function creates static content files in the static folder
    -- and names them based on a hash of their content. This allows
    -- expiration dates to be set far in the future without worry of
    -- users receiving stale content.
    addStaticContent =
        addStaticContentExternal minifym genFileName Settings.staticDir (StaticR . flip StaticRoute [])
      where
        -- Generate a unique filename based on the content itself
        genFileName lbs
            | development = "autogen-" ++ base64md5 lbs
            | otherwise   = base64md5 lbs

    -- Place Javascript at bottom of the body tag so the rest of the page loads first
    jsLoader _ = BottomOfBody

    -- What messages should be logged. The following includes all messages when
    -- in development, and warnings and errors in production.
    shouldLog _ _source level = 
        development || level == LevelWarn || level == LevelError

    makeLogger = return . appLogger

    maximumContentLength _ (Just FCMusicRegisterR) = Just $ 500 * 1024 * 1024
    maximumContentLength _ (Just (FCUpdateMusicR _)) = Just $ 100 * 1024 * 1024
    maximumContentLength _ _ = Just $ 2 * 1024 * 1024

isLoggedIn :: Handler AuthResult
isLoggedIn = do
  mUserId <- maybeAuthId
  return $ case mUserId of
    Nothing -> AuthenticationRequired
    Just _ -> Authorized

fullscreenLayout :: WidgetT App IO () -> HandlerT App IO Html
fullscreenLayout widget = do
  master <- getYesod
  mmsg <- getMessage
  mUserId <- maybeAuthId
  pc <- widgetToPageContent $ do
      $(combineStylesheets 'StaticR
          [ css_normalize_css
          , css_bootstrap_min_css
          ])
      $(widgetFile "fullscreen-layout")
  navbar <- widgetToPageContent
      $(widgetFile "fullscreen-navbar")
  giveUrlRenderer $(hamletFile "templates/fullscreen-layout-wrapper.hamlet")

-- How to run database actions.
instance YesodPersist App where
    type YesodPersistBackend App = SqlPersistT
    runDB = defaultRunDB persistConfig connPool
instance YesodPersistRunner App where
    getDBRunner = defaultGetDBRunner connPool

instance YesodAuth App where
    type AuthId App = Text

    -- Where to send a user after successful login
    loginDest _ = FCHomeR
    -- Where to send a user after logout
    logoutDest _ = FCHomeR
    --getAuthId = return . Just . credsIdent
    authLayout = defaultLayout
{--    loginHandler = do
      tp <- getRouteToParent
      lift $ authLayout $ do
        setTitleI Msg.LoginTitle
        master <- getYesod
        auths <- mapM_ (flip apLogin tp) (authPlugins master)
        $(widgetFile "auth")--}
    getAuthId creds = runDB $ do
        x <- getBy $ UniqueUser $ credsIdent creds
        case x of
            Just (Entity _ user) -> return $ Just $ userIdent user
            Nothing -> do
                _ <- insert User { userIdent = credsIdent creds
                            , userPassword = Nothing }
                return $ Just $ credsIdent creds
    -- You can add other plugins like BrowserID, email or OAuth here
    authPlugins _ = [authBrowserId def,
                     authGoogleEmail]

    authHttpManager = httpManager
    maybeAuthId = lookupSession "_ID"

-- This instance is required to use forms. You can modify renderMessage to
-- achieve customized and internationalized form validation messages.
instance RenderMessage App FormMessage where
    renderMessage _ _ = defaultFormMessage

-- | Get the 'Extra' value, used to hold data from the settings.yml file.
getExtra :: Handler Extra
getExtra = fmap (appExtra . settings) getYesod

-- Note: previous versions of the scaffolding included a deliver function to
-- send emails. Unfortunately, there are too many different options for us to
-- give a reasonable default. Instead, the information is available on the
-- wiki:
--
-- https://github.com/yesodweb/yesod/wiki/Sending-email
