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
  let musicId = fromJust $ fromText2Id <$> mMusicId :: FCMusicDataId
  mMusicData <- runDB $ get musicId
  configData <- liftIO $ readConfigFile . T.unpack . fCMusicDataConfigPath $ fromJust mMusicData
  fullscreenLayout $ do
    setTitle "FC -Typing Game-"
    addStylesheetRemote "http://fonts.googleapis.com/css?family=Poiret+One"
    addScript $ StaticR js_fc_visualize_js
    addScript $ StaticR js_fc_typingGame_js
    let gauge = $(widgetFile "graphics/gauge")
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
  scoreSum <- runInputPost $ ireq textField "score-sum-val"
  correctNum <- runInputPost $ ireq intField "correct-val"
  missNum <- runInputPost $ ireq intField "miss-val"
  speed <- runInputPost $ ireq textField "speed-val"
  solvedNum <- runInputPost $ ireq intField "solved-val"
  maxSpeed <- runInputPost $ ireq textField "max-speed-val"
  maxComboNum <- runInputPost $ ireq intField "max-combo-val"
  typeNum <- runInputPost $ ireq intField "type-number-val"
  problemNum <- runInputPost $ ireq intField "problem-number-val"
  difficulty <- runInputPost $ ireq textField "difficulty-val"
  _ <- runDB $ do
      let scoreSumNum = read $ T.unpack scoreSum
          speedNum = read $ T.unpack speed
          maxSpeedNum = read $ T.unpack maxSpeed
      mMusicData <- getBy $ UniqueMusic musicId
      case mMusicData of
        Just _ -> do
          updateWhere [FCTypingMusicDataMusicId ==. musicId]
                      [FCTypingMusicDataDifficulty =. difficulty,
                       FCTypingMusicDataTypeNumber =. typeNum,
                       FCTypingMusicDataProblemNumber =. problemNum]
        Nothing -> do
          _ <- insert $ FCTypingMusicData musicId difficulty typeNum problemNum
          return ()

      _ <- insert $ FCTypingRecord musicId userId scoreSumNum correctNum missNum speedNum solvedNum maxSpeedNum maxComboNum
      return ()
  setMessage "Record Saved"
  redirect FCTypingR
