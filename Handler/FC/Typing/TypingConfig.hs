module Handler.FC.Typing.TypingConfig where

import Import
import qualified FC.Typing.IO as FCTI
import qualified Data.Text as T
import Data.Maybe

getFCTypingConfigR :: Text -> Handler Value
getFCTypingConfigR idNum= do
  musicData <- runDB $ get $ fromText2Id idNum
  $logInfo $ T.pack $ show musicData
  let path = T.unpack $ fCMusicDataConfigPath $ fromJust musicData
--  file <- liftIO $ B.readFile path
--  $logInfo $ TL.toStrict $ E.decodeUtf8 file
--  $logInfo $ fCTypingMusicConfigPath $ fromJust musicData
  mConfig <- liftIO $ FCTI.parseConfigFile path
  return $ toJSON $ fromJust mConfig
