module Handler.FC.Typing.MusicRegister where

import Import
import qualified FC.Data.Music as FCDM
import qualified FC.Form.Fields as FCField
import qualified FC.Typing.IO as FCTI
import System.FilePath
import qualified Data.Text as T
import Data.Maybe

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
           Just pictureFile -> liftIO $ Just <$> (FCTI.writeToServer packageDir
                              pictureFile)
           _ -> return Nothing
      configFilename <- case (FCDM.configData musicData) of
           Just configFile -> liftIO $ Just <$> (FCTI.writeToServer packageDir
                              configFile)
           _ -> return Nothing
      $logInfo $ T.append (FCDM.title musicData) $ T.pack "'s lyric data has been saved."
      let mTitle = FCDM.title musicData
          mMusician = FCDM.musician musicData
          mGenre = (map $ T.pack .show) <$> FCDM.genre musicData
          mFormat = FCDM.format musicData
          mSoundSrc = T.pack $ pathSeparator:musicFilename
          mLyricSrc = T.pack lyricFilename
          mPictureSrc = T.pack <$> ((pathSeparator:) <$> pictureFilename)
          mConfigSrc = T.pack <$> configFilename
      case configFilename of
        Just configPath -> do
          configData <- liftIO $ FCTI.parseConfigFile configPath
          case configData of
            Just _ -> do
              _ <- runDB $ insert $
                   FCTypingMusic
                   (FCDM.title musicData)
                   (FCDM.musician musicData)
                   ((map $ T.pack . show) <$> FCDM.genre musicData)
                   Nothing
                   (T.pack $ show mFormat)
                   mSoundSrc
                   mLyricSrc
                   mPictureSrc
                   (fromJust mConfigSrc)
              redirect FCTypingR
            Nothing -> do
              setSessions mTitle mMusician mGenre mFormat mSoundSrc mLyricSrc mPictureSrc
              redirect $ FCMusicEditorR mTitle
        Nothing -> do
          setSessions mTitle mMusician mGenre mFormat mSoundSrc mLyricSrc mPictureSrc
          redirect $ FCMusicEditorR mTitle
    _ -> do
      setMessage "Music Data Saving Process Failed"
      redirect FCMusicRegisterR
    where setSessions mTitle mMusician mGenre mFormat mSoundSrc mLyricSrc mPictureSrc = do
            setMessage "Music Data saved"
            setSession "mTitle" mTitle
            setSession "mMusician" mMusician
            setSession "mGenre" $ T.pack $ show mGenre
            setSession "mFormat" $ T.pack $ show mFormat
            setSession "mSoundSrc" mSoundSrc
            setSession "mLyricSrc" mLyricSrc
            setSession "mPictureSrc" $ (T.pack . show) $ mPictureSrc
