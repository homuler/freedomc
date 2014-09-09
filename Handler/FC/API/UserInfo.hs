module Handler.FC.API.UserInfo where

import Import
import Text.Hamlet (shamletFile)
import qualified Data.Text as T

getUserInfoAPIR :: Handler TypedContent
getUserInfoAPIR = do
  userid <- lookupGetParam "userid"
  case userid of
    Just uid -> do
      mUserInfo <- runDB $ get $ fromText2Id uid :: Handler (Maybe User)
      selectRep $ do
        provideRep $ return $(shamletFile "templates/fc/user-info.get.hamlet")
        provideRep $ return $
          case mUserInfo of
            Just userInfo -> object ["userId" .= uid,
                                     "name" .= (userIdent userInfo)]
            Nothing -> object ["userId" .= uid]
    Nothing -> do
      selectRep $ do
        provideRep $ return [shamlet| <p>userid is required.|]
        provideRep $ return $ object ["error" .= (T.pack "userid is required.")]

postUserInfoAPIR :: Handler Html
postUserInfoAPIR = error "Not yet implemented: postUserInfoAPIR"
