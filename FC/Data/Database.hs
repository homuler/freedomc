module FC.Data.Database where

import Import
import Data.Maybe
import qualified Data.Map as Map
import qualified Data.Text as T

getDataMap = do
  ents <- runDB $ selectList [] []
  return $ Map.fromList $ map (\(Entity id val) -> (fromId2Text id, val)) ents

data FCTypingRecordCombined = FCTypingRecordCombined
                              { userName :: Text,
                                musicTitle :: Text,
                                score :: Double,
                                correct :: Int,
                                miss :: Int,
                                speed :: Double,
                                solved :: Int,
                                maxSpeed :: Double,
                                maxCombo :: Int } deriving (Show)

instance ToJSON FCTypingRecordCombined where
  toJSON
    (FCTypingRecordCombined uname mname sc cr mi sp sl mxs mxc) =
    object ["userName" .= uname, "musicTitle" .= mname,
            "score" .= sc, "correct" .= cr,
            "miss" .= mi, "speed" .= sp,
            "solved" .= sl, "max-spped" .= mxs,
            "max-combo" .= mxc]

fromFCTR2FCTRC :: (Map.Map Text User) -> (Map.Map Text FCMusicData) -> FCTypingRecord -> FCTypingRecordCombined
fromFCTR2FCTRC umap mmap record =
  let uname = fromMaybe "guest" $ userIdent <$> (Map.lookup (fromId2Text $ fCTypingRecordUserId record) umap)
      title = fromMaybe "unknown" $ fCMusicDataTitle <$> (Map.lookup (fromId2Text $ fCTypingRecordMusicId record) mmap)
  in FCTypingRecordCombined uname
                            title
                            (fCTypingRecordScoreSum record)
                            (fCTypingRecordCorrect record)
                            (fCTypingRecordMiss record)
                            (fCTypingRecordSpeed record)
                            (fCTypingRecordSolved record)
                            (fCTypingRecordMaxSpeed record)
                            (fCTypingRecordMaxCombo record)
