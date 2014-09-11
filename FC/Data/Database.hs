module FC.Data.Database where

import Import
import Data.Maybe
import qualified Data.Map as Map
import qualified Data.Text as T

getDataMap = do
  ents <- runDB $ selectList [] []
  return $ Map.fromList $ map (\(Entity id val) -> (fromId2Text id, val)) ents

getDataMapWithKey f = do
  ents <- runDB $ selectList [] []
  return $ Map.fromList $ map (\(Entity _ val) -> (fromId2Text $ f val, val)) ents

data FCTypingRecordCombined = FCTypingRecordCombined
                              { user :: Maybe User,
                                musicTitle :: Maybe Text,
                                score :: Double,
                                correct :: Int,
                                miss :: Int,
                                speed :: Double,
                                solved :: Int,
                                maxSpeed :: Double,
                                maxCombo :: Int,
                                typingMusic :: Maybe FCTypingMusicData }
                            deriving (Show)

instance ToJSON FCTypingRecordCombined where
  toJSON
    (FCTypingRecordCombined userInfo mname sc cr mi sp sl mxs mxc tmdata) =
    object ["user" .= userInfo, "musicTitle" .= mname,
            "score" .= sc, "correct" .= cr,
            "miss" .= mi, "speed" .= sp,
            "solved" .= sl, "max-spped" .= mxs,
            "max-combo" .= mxc, "typingData" .= tmdata]

fromFCTR2FCTRC :: (Map.Map Text User) -> (Map.Map Text FCMusicData) -> (Map.Map Text FCTypingMusicData) -> FCTypingRecord -> FCTypingRecordCombined
fromFCTR2FCTRC umap mmap tmmap record =
  let userInfo = Map.lookup (fromId2Text $ fCTypingRecordUserId record) umap
      title = fCMusicDataTitle <$> (Map.lookup (fromId2Text $ fCTypingRecordMusicId record) mmap)
      tmData = Map.lookup (fromId2Text $ fCTypingRecordMusicId record) tmmap
  in FCTypingRecordCombined userInfo
                            title
                            (fCTypingRecordScoreSum record)
                            (fCTypingRecordCorrect record)
                            (fCTypingRecordMiss record)
                            (fCTypingRecordSpeed record)
                            (fCTypingRecordSolved record)
                            (fCTypingRecordMaxSpeed record)
                            (fCTypingRecordMaxCombo record)
                            tmData
