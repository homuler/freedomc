module FC.Data.Typing where

import Import
import qualified FC.Data.Music as FCDM
import qualified Data.Text as T
import Control.Monad

data ProblemInfo = ProblemInfo { display :: T.Text,
                                 problem :: T.Text,
                                 startTime :: Double,
                                 endTime :: Double }
                   deriving (Eq, Show, Read)

instance FromJSON ProblemInfo where
  parseJSON (Object v) = ProblemInfo <$>
                         v .: "display" <*>
                         v .: "problem" <*>
                         v .: "startTime" <*>
                         v .: "endTime"
  parseJSON _ = mzero

instance ToJSON ProblemInfo where
  toJSON (ProblemInfo display problem startTime endTime) =
    object ["display" .= display, "problem" .= problem,
            "startTime" .= startTime, "endTime" .= endTime]

data TypingMusicInfo = TypingMusicInfo { title :: T.Text,
                                         musician :: T.Text,
                                         genre :: Maybe [FCDM.MusicGenre],
                                         format :: T.Text,
                                         musicSrc :: FilePath,
                                         lyricSrc :: FilePath,
                                         pictureSrc :: Maybe FilePath,
                                         problems :: [ProblemInfo] }
                       deriving (Eq, Show, Read)

instance FromJSON TypingMusicInfo where
  parseJSON (Object v) = TypingMusicInfo <$>
                         v .: "title" <*>
                         v .: "musician" <*>
                         v .: "genre" <*>
                         v .: "format" <*>
                         v .: "musicSrc" <*>
                         v .: "lyricSrc" <*>
                         v .: "pictureSrc" <*>
                         v .: "problems"
  parseJSON _ = mzero

instance ToJSON TypingMusicInfo where
  toJSON (TypingMusicInfo title musician genre format musicSrc lyricSrc pictureSrc problems) =
    object ["title" .= title, "musician" .= musician, "genre" .= genre,
            "format" .= format, "musicSrc" .= musicSrc, "lyricSrc" .= lyricSrc,
            "pictureSrc" .= pictureSrc, "problems" .= problems]

data TypingMusicInfoWithData = TypingMusicInfoWithData { musicInfo :: TypingMusicInfo,
                                                         soundData :: Maybe FileInfo,
                                                         pictureData :: Maybe FileInfo }

data MusicDataUpdated = MusicDataUpdated { newMusicInfo :: TypingMusicInfo,
                                           newSoundData :: Maybe FileInfo,
                                           newPictureData :: Maybe FileInfo }

