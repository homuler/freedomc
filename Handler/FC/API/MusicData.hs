module Handler.FC.API.MusicData where

import Import
import qualified Data.Text as T
import Text.Hamlet (shamlet, shamletFile)
import Data.Maybe

getMusicDataAPIR :: Handler TypedContent
getMusicDataAPIR = do
  musicid <- lookupGetParam "musicid"
  case musicid of
    Just mid -> do
      mMusicData <- runDB $ get $ fromText2Id mid :: Handler (Maybe FCMusicData)
      selectRep $ do
        provideRep $ return $(shamletFile "templates/fc/music-data.get.hamlet")
        provideRep $ return $
          case mMusicData of
            Just musicData -> object ["musicId" .= mid,
                                      "title" .= (fCMusicDataTitle musicData),
                                      "musician" .= (fCMusicDataMusician musicData),
                                      "genre" .= (fromMaybe [] $ fCMusicDataGenre musicData)]
            Nothing -> object ["error" .= (T.append "Music Data is not Found: musicid = " mid)]
    Nothing -> do
      selectRep $ do
        provideRep $ return [shamlet| <p>musicid is required.|]
        provideRep $ return $ object ["error" .= (T.pack "music is required.")]

postMusicDataAPIR :: Handler Html
postMusicDataAPIR = error "Not yet implemented: postMusicDataAPIR"
