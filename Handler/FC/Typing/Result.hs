module Handler.FC.Typing.Result where

import Import
import Yesod.Auth
import Text.Hamlet (shamletFile)
import qualified Data.Map as Map
import qualified Data.Text as T
import Data.List (sortBy)
import Data.Maybe
import Text.Julius (rawJS)
import qualified FC.Data.Database as FCDB

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
  typingRecords' <- runDB $ selectList options [ Asc FCTypingRecordUserId,
                                                Asc FCTypingRecordUserId,
                                                Desc FCTypingRecordScoreSum]
  usersMap <- FCDB.getDataMap :: Handler (Map.Map Text User)
  musicDataMap <- FCDB.getDataMap :: Handler (Map.Map Text FCMusicData)
  let typingRecords = map (\(Entity _ x) -> FCDB.fromFCTR2FCTRC usersMap musicDataMap x) typingRecords'
  $logInfo $ T.pack $ show typingRecords
  selectRep $ do
    provideRep $ return $(shamletFile "templates/fc/fc-typing-record.hamlet")
    provideRep $ return $ object ["records" .= typingRecords]

getFCTypingShowRankingR :: Handler Html
getFCTypingShowRankingR = do
  userOnly <- lookupGetParam "user"
  musicId <- lookupGetParam "musicid"
  let userValue = fromMaybe "false" userOnly
      musicidValue = fromMaybe "0" musicId
  defaultLayout $(widgetFile "fc/fc-typing-ranking")
