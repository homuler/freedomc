module Handler.FC.MusicManager where

import Import

getFCMusicManagerR :: Handler Html
getFCMusicManagerR = do
  (musicWidget, formEnctype) <- generateFormPost $ musicUploadForm "Choose a Music File"
  (lyricWidget, _) <- generateFormPost $ musicUploadForm "Choose a Lyric File"
  let submission = Nothing :: Maybe (FileInfo, Text)
  defaultLayout $ do
    setTitle "Freedom Concerto -Music Manager-"
    $(widgetFile "fc/fc-music-manager")
--getFCMusicManagerR = error "Not yet implemented getFCMusicManagerR"

postFCMusicManagerR :: Handler Html
postFCMusicManagerR = error "Not yet implemented: postFCMusicManagerR"

musicUploadForm :: FieldSettings (HandlerSite (HandlerT App IO)) -> Form (FileInfo, Text)
musicUploadForm msg = renderDivs $ (,)
                  <$> fileAFormReq msg
                  <*> areq textField "What's on the file?" Nothing
