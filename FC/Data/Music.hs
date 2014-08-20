module FC.Data.Music where

import Import
import qualified Data.Text as T
import Control.Monad

data MusicFormat = Video | Sound
                 deriving (Eq, Read, Show, Enum, Bounded)

data MusicGenre = Anime | Movie | USA
                                  deriving (Eq, Read, Show, Enum, Bounded)

data MusicDifficulty = Easy | Normal | Hard | ExtraHard | Extreme | Lunatic
                                  deriving (Eq, Read, Show, Enum, Bounded)

instance FromJSON MusicGenre where
  parseJSON (String v) = case T.unpack v of
    "Anime" -> return Anime
    "Movie" -> return Movie
    "USA"   -> return USA
    _ -> mzero
  parseJSON _ = mzero

instance ToJSON MusicGenre where
  toJSON x = String (T.pack $ show x)

data MusicData = MusicData { title :: Text,
                             musician :: Text,
                             genre :: Maybe [MusicGenre],
                             format :: MusicFormat,
                             soundData :: FileInfo,
                             lyricData :: FileInfo,
                             pictureData :: Maybe FileInfo,
                             configData :: Maybe FileInfo }

genres :: [(T.Text, MusicGenre)]
genres = map (\x -> (T.pack $ show x, x)) [minBound..maxBound]

formats :: [(Text, MusicFormat)]
formats = map (\x -> (T.pack $ show x, x))
          ([minBound..maxBound] :: [MusicFormat])
