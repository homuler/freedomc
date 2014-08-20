module Handler.FC.Typing.MusicRegister where

import Import
import qualified FC.Data.Music as FCDM
import qualified FC.Form.Fields as FCField
import qualified FC.Typing.IO as FCTI
import System.FilePath
import System.Directory
import qualified Data.Text as T
import qualified Data.Char as C
import Control.Monad

musicUploadForm :: Html -> MForm Handler (FormResult FCDM.MusicData, Widget)
musicUploadForm extra = do
  (titleRes, titleView) <-
    mreq textField
    (bootstrapFieldSettings "Music Title") Nothing
  (musicianRes, musicianView) <-
    mreq textField
    (bootstrapFieldSettings "Musician Name") Nothing
  (genreRes, genreView) <-
    mopt (FCField.multiCheckBoxList FCDM.genres)
    "Music Genre" Nothing
  (formatRes, formatView) <-
    mreq (radioFieldList FCDM.formats)
    "Music Format" $ Just FCDM.Video
  (musicFileRes, musicFileView) <-
    mreq fileField
--    (bootstrapFieldSettings "Music File") Nothing
    "Music File" Nothing
  (lyricFileRes, lyricFileView) <-
    mreq fileField
    "Lyric File" Nothing
  (pictureFileRes, pictureFileView) <-
    mopt fileField
    (hiddenFieldSettings "Picture File") Nothing
  (configFileRes, configFileView) <-
    mopt fileField
    "Config File" Nothing
  let musicDataRes = FCDM.MusicData <$> titleRes
                                    <*> musicianRes
                                    <*> genreRes
                                    <*> formatRes
                                    <*> musicFileRes
                                    <*> lyricFileRes
                                    <*> pictureFileRes
                                    <*> configFileRes
      widget = $(widgetFile "fc/fc-music-register-form")
  return (musicDataRes, widget)

getFCMusicRegisterR :: Handler Html
getFCMusicRegisterR = do
  ((_, widget), enctype) <- runFormPost musicUploadForm
  defaultLayout $ do
    setTitle "FC -Music Register-"
    $(widgetFile "fc/fc-music-register")

postFCMusicRegisterR :: Handler Html
postFCMusicRegisterR = do
  ((result, widget), enctype) <- runFormPost musicUploadForm
  case result of
    FormSuccess musicData -> do
      $logInfo $ "post success"
      packageDir <- liftIO $ FCTI.getDirName $ T.unpack $ FCDM.title musicData
      liftIO $ FCTI.createMusicDirectory packageDir
      $logInfo $ T.append "directory created" $ T.pack packageDir
      musicFilename <- liftIO $ FCTI.writeToServer packageDir
                       (FCDM.soundData musicData)
      $logInfo $ T.append (FCDM.title musicData) $ T.pack "'s music data has been saved."
      lyricFilename <- liftIO $ FCTI.writeToServer packageDir
                       (FCDM.lyricData musicData)
      pictureFilename <- case (FCDM.pictureData musicData) of
           Just pictureFile -> liftIO $ FCTI.writeToServer packageDir
                              pictureFile
           _ -> return ""
      _ <- case (FCDM.configData musicData) of
           Just configFile -> liftIO $ FCTI.writeToServer packageDir
                              configFile
           _ -> return ""
      $logInfo $ T.append (FCDM.title musicData) $ T.pack "'s lyric data has been saved."
      setMessage "Music Data saved"
      setSession "mTitle" $ FCDM.title musicData
      setSession "mMusician" $ FCDM.musician musicData
      setSession "mGenre" $ (T.pack . show) $ FCDM.genre musicData
      case FCDM.format musicData of
        FCDM.Video -> setSession "mFormat" "Video"
        FCDM.Sound -> setSession "mFormat" "Sound"
      setSession "mSoundSrc" $ T.pack $ pathSeparator:musicFilename
      setSession "mLyricSrc" $ T.pack lyricFilename
      setSession "mPictureSrc" $
        case pictureFilename of
             "" -> "Nothing"
             _ -> T.pack . show $ Just $ pathSeparator:pictureFilename
      setSession "mConfigSrc" $ (T.pack . show) $ fileName
        <$> FCDM.configData musicData
      redirect $ FCMusicEditorR $ FCDM.title musicData
    _ -> do
      setMessage "Music Data Saving Process Failed"
      redirect FCMusicRegisterR
