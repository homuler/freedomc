module Handler.FC.Typing.Result where

import Import
import Yesod.Auth
import Text.Hamlet (shamletFile)
import qualified Data.Text as T
import Data.List (sortBy)
import Data.Maybe
import Text.Julius (rawJS)

  -- JSON Version is not implemented yet.
getFCTypingResultR :: Handler TypedContent
getFCTypingResultR = do
  userOnly <- lookupGetParam "user"
  userId <- case userOnly of
        Just "true" -> maybeAuthId
        _ -> return Nothing
  musicId <- lookupGetParam "musicid"
  let options = case (userId, fromText2Id <$> musicId) of
        (Just uid, Just mid) -> [ FCTypingRecordUserId ==. uid,
                                  FCTypingRecordMusicId ==. mid ]
        (Just uid, Nothing) -> [ FCTypingRecordUserId ==. uid ]
        (Nothing, Just mid) -> [ FCTypingRecordMusicId ==. mid ]
        (Nothing, Nothing) -> []
  typingRecords <- runDB $ selectList options [ Asc FCTypingRecordUserId,
                                                Asc FCTypingRecordUserId,
                                                Desc FCTypingRecordScoreSum]
  $logInfo $ T.pack $ show typingRecords
  selectRep $ do
    provideRep $ return $(shamletFile "templates/fc/fc-typing-record.hamlet")
    provideRep $ return $
      object ["records" .= (map (\(Entity _ x) -> x) typingRecords)]

getFCTypingShowRankingR :: Handler Html
getFCTypingShowRankingR = do
  userOnly <- lookupGetParam "user"
  musicId <- lookupGetParam "musicid"
  let userValue = fromMaybe "false" userOnly
      musicidValue = fromMaybe "0" musicId
  defaultLayout $(widgetFile "fc/fc-typing-ranking")
