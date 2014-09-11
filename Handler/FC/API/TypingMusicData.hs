module Handler.FC.API.TypingMusicData where

import Import
import qualified Data.Text as T
import Text.Hamlet (shamletFile, shamlet)

getTypingMusicDataAPIR :: Handler TypedContent
getTypingMusicDataAPIR = do
  musicid <- lookupGetParam "musicid"
  case musicid of
    Just mid -> do
      mTypingMusicData <- runDB $ getBy $ UniqueMusic $ fromText2Id mid :: Handler (Maybe (Entity FCTypingMusicData))
      selectRep $ do
        provideRep $ return $(shamletFile "templates/fc/typing-music-data.get.hamlet")
        provideRep $ return $
          case mTypingMusicData of
            Just (Entity _ musicData) ->
              object ["musicId" .= mid,
                      "difficulty" .= (fCTypingMusicDataDifficulty musicData),
                      "typeNumber" .= (fCTypingMusicDataTypeNumber musicData),
                      "problemNumber" .= (fCTypingMusicDataProblemNumber musicData)]
            Nothing -> object ["error" .= (T.append "Music Data is not Found: musicid = " mid)]
    Nothing -> do
      selectRep $ do
        provideRep $ return [shamlet| <p>musicid is required.|]
        provideRep $ return $ object ["error" .= (T.pack "Parameter is required: musicid")]

postTypingMusicDataAPIR :: Handler Html
postTypingMusicDataAPIR = error "Not yet implemented: postTypingMusicDataAPIR"
