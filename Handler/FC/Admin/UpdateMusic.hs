module Handler.FC.Admin.UpdateMusic where

import Import
import Control.Monad
import Data.Maybe
import qualified Data.Text as T
import System.FilePath
import qualified FC.Data.Typing as FCDT
import qualified FC.Data.Music as FCDM
import qualified FC.Form.Fields as FCField
import qualified FC.Field.Typing as FCFT
import qualified FC.Typing.IO as FCTI

fcMusicUpdaterForm :: FCMusicData -> Html ->
                      MForm Handler (FormResult FCDT.MusicDataUpdated, Widget)
fcMusicUpdaterForm musicData extra = do
  let title = fCMusicDataTitle musicData
      musician = fCMusicDataMusician musicData
      mGenres  = fCMusicDataGenre musicData
      format = read . T.unpack $ fCMusicDataFormat musicData
      soundSrc = fCMusicDataSoundPath musicData
      lyricSrc = fCMusicDataLyricPath musicData
      mPictureSrc = fCMusicDataPicturePath musicData
      configSrc = fCMusicDataConfigPath musicData
  mMusicInfo <- liftIO $ FCTI.parseConfigFile $ T.unpack configSrc
  $logInfo $ T.pack $ show musicData
  case mMusicInfo of
    Nothing ->error "Can't parse the config file"
    Just musicInfo -> do
        (titleRes, titleView) <-
          mreq textField
          (bootstrapFieldSettings "Music Title") $ Just title
        (musicianRes, musicianView) <-
          mreq textField
          (bootstrapFieldSettings "Musician Name") $ Just musician
        (genreRes, genreView) <-
          mopt (FCField.multiCheckBoxList FCDM.genres)
          "Genre" $ Just <$> (map (read . T.unpack)) <$> mGenres
        (formatRes, formatView) <-
          mreq (radioFieldList FCDM.formats)
          "Format" $ Just FCDM.Video
        (soundSrcRes, soundSrcView) <-
          mreq textField
          (readOnlyFieldSettings "Music Source Path") $ Just soundSrc
        (lyricSrcRes, lyricSrcView) <-
          mreq textField
          (readOnlyFieldSettings "Lyric Source Path") $ Just lyricSrc
        (pictureSrcRes, pictureSrcView) <-
          mopt textField
          (readOnlyFieldSettings "Picture File Path") $ Just <$> mPictureSrc
        (soundFileRes, soundFileView) <-
          mopt fileField
          "Music Source File" Nothing
        (pictureFileRes, pictureFileView) <-
          mopt fileField
          "Picture File" Nothing
        let packageDir = takeDirectory $ T.unpack lyricSrc
        pFields <- forM (zip [1..] $ FCDT.problems musicInfo)
                          (\(i, pb)  -> do
                            p <- lookupSession (T.pack $ "problem" ++ show i)
                            st <- lookupSession (T.pack $ "startTime" ++ show i)
                            ed <- lookupSession (T.pack $ "endTime" ++ show i)
                            let w = FCDT.display pb
                                x = fromMaybe (FCDT.problem pb) p
                                y = read . T.unpack $ fromMaybe (T.pack . show $ FCDT.startTime pb) st
                                z = read . T.unpack $ fromMaybe (T.pack . show $ FCDT.endTime pb) ed
                            mreq (FCFT.problemField w i) "Problem Info"
                              $ Just $ FCDT.ProblemInfo w x y z
                        )
        let (problemResList, problemsView) = unzip pFields
            problemsRes = foldr
                          (\x acc -> (:) <$> x <*> acc)
                          (FormSuccess []) problemResList
            tmInfoRes = FCDT.TypingMusicInfo <$> titleRes
                                             <*> musicianRes
                                             <*> genreRes
                                             <*> (T.pack . show <$> formatRes)
                                             <*> (T.unpack <$> soundSrcRes)
                                             <*> (T.unpack <$> lyricSrcRes)
                                             <*> ((T.unpack <$>) <$> pictureSrcRes)
                                             <*> problemsRes
            newMusicDataRes = FCDT.MusicDataUpdated <$> tmInfoRes
                                                    <*> soundFileRes
                                                    <*> pictureFileRes
            widget = $(widgetFile "fc/fc-music-updater-form")
        return (newMusicDataRes, widget)

getFCUpdateMusicR :: Text -> Handler Html
getFCUpdateMusicR musicId = do
  mMusicData <- runDB $ get $ fromText2Id musicId
  case mMusicData of
    Just musicData -> do
      ((result, widget), enctype) <- runFormPost $ fcMusicUpdaterForm musicData
      defaultLayout $ do
        setTitle "FC -Music Updater-"
        addScript $ StaticR js_fc_util_js
        $(widgetFile "fc/fc-music-updater")
    Nothing -> error "No music data found"

-- Config File stays untouch --
postFCUpdateMusicR :: Text -> Handler Html
postFCUpdateMusicR musicId = do
  mMusicData <- runDB $ get $ fromText2Id musicId
  let temp = FCMusicData "" "" Nothing "Video" "" "" Nothing ""
  case mMusicData of
    Just musicData -> do
      ((result, widget), enctype) <- runFormPost $ fcMusicUpdaterForm musicData
      case result of
        FormSuccess newMusicData -> do
          let jsonPath = fCMusicDataConfigPath musicData
              packageDir = takeDirectory $ T.unpack jsonPath
          liftIO $ FCTI.saveConfigFile (FCDT.newMusicInfo newMusicData) $ T.unpack jsonPath
          newSoundPath <- liftIO $ case FCDT.newSoundData newMusicData of
            Just soundFile -> (pathSeparator:) <$> FCTI.writeToServer' packageDir soundFile
            Nothing -> return $ FCDT.musicSrc $ FCDT.newMusicInfo newMusicData
          newPicturePath <- liftIO $ case FCDT.newPictureData newMusicData of
            Just pictureFile -> Just <$> ((pathSeparator:) <$> FCTI.writeToServer' packageDir pictureFile)
            Nothing -> return $ FCDT.pictureSrc $ FCDT.newMusicInfo newMusicData
          $logInfo $ T.pack $ show $ FCDT.newMusicInfo newMusicData
          _ <- mapM (\i -> do
                        deleteSession $ T.pack $ "problem" ++ show i
                        deleteSession $ T.pack $ "startTime" ++ show i
                        deleteSession $ T.pack $ "endTime" ++ show i)
               [1..(Import.length $ FCDT.problems $ FCDT.newMusicInfo newMusicData)]
          runDB $
            updateWhere [FCMusicDataId ==. fromText2Id musicId]
                        [FCMusicDataSoundPath =. T.pack newSoundPath,
                         FCMusicDataPicturePath =. T.pack <$> newPicturePath,
                         FCMusicDataGenre =.  map (T.pack . show) <$> (FCDT.genre $ FCDT.newMusicInfo newMusicData),
                         FCMusicDataFormat =. (FCDT.format $ FCDT.newMusicInfo newMusicData)]
          setMessage "Music Updated"
          redirect FCTypingR
        FormFailure text -> do
          $logInfo "Form Failure"
          setMessage "Update failed"
          redirect $ FCUpdateMusicR musicId
        FormMissing -> do
          $logInfo "Form Missing"
          setMessage "Some Form is missing"
          redirect $ FCUpdateMusicR musicId
    Nothing -> error "Music Data is already deleted"
