module Handler.FC.Typing.Game where

import Import
import Yesod.Auth
import FC.Typing.IO
import qualified Data.Text as T
import Text.Julius (rawJS)
import Data.Maybe

getFCTypingGameR :: Handler Html
getFCTypingGameR = do
  mMusicId <- lookupSession "gameMusicId"
  let musicId = fromJust $ fromText2Id <$> mMusicId :: FCTypingMusicId
  mMusicData <- runDB $ get musicId
  configData <- liftIO $ readConfigFile . T.unpack . fCTypingMusicConfigPath $ fromJust mMusicData
  fullscreenLayout $ do
    setTitle "FC -Typing Game-"
    addStylesheetRemote "http://fonts.googleapis.com/css?family=Poiret+One"
    addScript $ StaticR js_fc_typingGame_js
    let gauge = $(widgetFile "graphics/gauge")
        scorebar = $(widgetFile "graphics/score-bar")
        timebar = $(widgetFile "graphics/time-bar")
        speedGraph = $(widgetFile "graphics/speed-graph2") :: Widget
        scoreSpec = $(widgetFile "graphics/score-spec")
        scoreGraph = $(widgetFile "graphics/score-graph2")
    $(widgetFile "fc/fc-typing")

postFCTypingGameR :: Handler Html
postFCTypingGameR = do
  mMusicId <- lookupSession "gameMusicId"
  mUserIdent <- maybeAuthId
  -- dangerous pattern matching
  let userId = case mUserIdent of
        Just uid -> uid
        Nothing  -> error "Unknown Player"
  let musicId = fromJust $ fromText2Id <$> mMusicId
  score <- runInputPost $ ireq textField "score-sum-val"
  difficulty <- runInputPost $ ireq textField "difficulty-val"
  _ <- runDB $ do
      mMusicUserRecordEnt <- getBy $ UniqueTypingRecord musicId userId
      $logInfo $ T.pack $ show mMusicUserRecordEnt
      let mMusicUserRecord = case mMusicUserRecordEnt of
                              Just (Entity _ record) -> Just record
                              Nothing -> Nothing
          userPlayed = fromMaybe 0 $ fCTypingRecordPlayed <$> mMusicUserRecord
          userAvgScore = fromMaybe 0 $ fCTypingRecordAverage <$> mMusicUserRecord
          userMaxScore = fromMaybe 0 $ fCTypingRecordMaxScore <$> mMusicUserRecord
      let scoreNum = read $ T.unpack score
          newUserMaxScore = max userMaxScore scoreNum
          newUserPlayed = userPlayed + 1
          newUserAvgScore = (userAvgScore*(fromIntegral userPlayed) + scoreNum) / (fromIntegral newUserPlayed)
      case mMusicUserRecord of
        Just _ -> do
          updateWhere [FCTypingRecordMusicId ==. musicId,
                       FCTypingRecordUserId ==. userId]
                      [FCTypingRecordPlayed =. newUserPlayed,
                       FCTypingRecordAverage =. newUserAvgScore,
                       FCTypingRecordMaxScore =. newUserMaxScore]
        Nothing -> do
          _ <- insert $ FCTypingRecord musicId userId newUserPlayed newUserAvgScore newUserMaxScore
          return ()

      mMusicRecordEnt <- getBy $ UniqueMusicRecord musicId
      let mMusicRecord = case mMusicRecordEnt of
                              Just (Entity _ record) -> Just record
                              Nothing -> Nothing
          musicPlayed = fromMaybe 0 $ fCTypingMusicRecordPlayed <$> mMusicRecord
          musicAvgScore = fromMaybe 0 $ fCTypingMusicRecordAverage <$> mMusicRecord
          musicMaxScore = fromMaybe 0 $ fCTypingMusicRecordMaxScore <$> mMusicRecord
          newMusicAvgScore = (musicAvgScore*(fromIntegral musicPlayed) + scoreNum) / ((fromIntegral musicPlayed) + 1)
      case mMusicRecord of
        Just _ -> do
          if musicMaxScore < scoreNum
            then updateWhere [FCTypingMusicRecordMusicId ==. musicId]
                             [FCTypingMusicRecordUserId =. userId,
                              FCTypingMusicRecordPlayed +=. 1,
                              FCTypingMusicRecordAverage =. newMusicAvgScore,
                              FCTypingMusicRecordMaxScore =. scoreNum]
            else updateWhere [FCTypingMusicRecordMusicId ==. musicId]
                             [FCTypingMusicRecordPlayed +=. 1,
                              FCTypingMusicRecordAverage =. newMusicAvgScore]
        Nothing -> do
          _ <- insert $ FCTypingMusicRecord musicId userId 1 scoreNum scoreNum
          return ()
  setMessage "Record Saved"
  _ <- runDB $ do
    update musicId [FCTypingMusicDifficulty =. Just difficulty]
  redirect FCTypingR
