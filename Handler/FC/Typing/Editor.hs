module Handler.FC.Typing.Editor where

import Import
import qualified FC.Field.Typing as FCFT
import qualified FC.Data.Typing as FCDT
import qualified FC.Data.Music as FCDM
import qualified FC.Form.Fields as FCField
import qualified FC.Typing.IO as FCTI
--import qualified GHC.List as GL
import Control.Monad
import Data.Maybe
import Data.Text as T (append, pack, unpack, lines, null)
import Data.Text.IO
import System.FilePath

fcMusicEditorForm :: Html ->
                     MForm Handler (FormResult FCDT.TypingMusicInfo, Widget)
fcMusicEditorForm extra = do
  mTitle <- lookupSession "mTitle"
  mMusician <- lookupSession "mMusician"
  mGenre  <- lookupSession "mGenre"
  mFormat <- lookupSession "mFormat"
  mSoundSrc <- lookupSession "mSoundSrc"
  mLyricSrc <- lookupSession "mLyricSrc"
  mPictureSrc <- lookupSession "mPictureSrc"
  $logInfo $ T.append "genre = " $ T.pack $ show mGenre
  lyrics <- case mLyricSrc of
    Just lyricSrc -> liftIO . readLyrics $ T.unpack lyricSrc
    Nothing -> return []
  let musicFormat = fromMaybe FCDM.Video $ (read . T.unpack) <$> mFormat
      musicGenre  = (read . T.unpack) <$> mGenre
  $logInfo $ T.append "genre = " $ T.pack $ show musicGenre
  (titleRes, titleView) <-
    mreq textField
    (bootstrapFieldSettings "Music Title") $ mTitle
  (musicianRes, musicianView) <-
    mreq textField
    (bootstrapFieldSettings "Musician Name") $ mMusician
  (genreRes, genreView) <-
    mopt (FCField.multiCheckBoxList FCDM.genres)
    "Genre" musicGenre
  (soundRes, soundView) <-
    mreq textField
    (readOnlyFieldSettings "Music Source Path") $ mSoundSrc
  (lyricRes, lyricView) <-
    mreq textField
    (readOnlyFieldSettings "Lyric File Path") $ mLyricSrc
  (pictureRes, pictureView) <-
    mopt textField
    (readOnlyFieldSettings "Picture File Path") $
    ((read . unpack) <$> mPictureSrc :: Maybe (Maybe Text))
  let lyricPairs = zip [1..] lyrics
  lyricInfos <- foldr (\(i, t) acc -> do
                         p <- lookupSession (T.pack $ "problem" ++ show i)
                         st <- lookupSession (T.pack $ "startTime" ++ show i)
                         ed <- lookupSession (T.pack $ "endTime" ++ show i)
                         let x = fromMaybe t p
                             y = read . T.unpack $ fromMaybe "0" st
                             z = read . T.unpack $ fromMaybe "0" ed
                         tmp <- acc
                         return $ (x, y, z):tmp
                      ) (return [] :: MForm Handler [(Text, Double, Double)])
                   lyricPairs
  pfields <- forM (zip lyricPairs lyricInfos)
             (\((i, t), (ruby, st, ed))
              -> mreq (FCFT.problemField t i) "Problem Info"
                 $ Just $ FCDT.ProblemInfo t ruby st ed)
  let (problemResList, problemsView) = unzip pfields
      problemsRes = foldr
                    (\x acc -> (:) <$> x <*> acc)
                    (FormSuccess []) problemResList
      tmInfoRes = FCDT.TypingMusicInfo <$> titleRes
                                       <*> musicianRes
                                       <*> genreRes
                                       <*> (FormSuccess $ fromJust mFormat)
                                       <*> (T.unpack <$> soundRes)
                                       <*> (T.unpack <$> lyricRes)
                                       <*> ((T.unpack <$>) <$> pictureRes)
                                       <*> problemsRes
      widget = $(widgetFile "fc/fc-music-editor-form")
  return (tmInfoRes, widget)

getFCMusicEditorR :: Text -> Handler Html
getFCMusicEditorR musicTitle = do
  ((result, widget), enctype) <- runFormPost fcMusicEditorForm
  defaultLayout $ do
    setTitle "FC -Music Editor-"
    addScript $StaticR js_fc_util_js
    $(widgetFile "fc/fc-music-editor")

postFCMusicEditorR :: Text -> Handler Html
postFCMusicEditorR musicTitle = do
  ((result, widget), enctype) <- runFormPost fcMusicEditorForm
  case result of
    FormSuccess musicInfo -> do
      let targetDir = takeDirectory $ FCDT.lyricSrc musicInfo
          jsonPath = combine targetDir $ (T.unpack musicTitle) ++ ".json"
      mFormat <- lookupSession "mFormat"
      liftIO $ FCTI.saveConfigFile musicInfo jsonPath
      _ <- mapM (\(i, _) -> do
               deleteSession $ T.pack $ "problem" ++ show i
               deleteSession $ T.pack $ "startTime" ++ show i
               deleteSession $ T.pack $ "endTime" ++ show i)
        $ zip ([1..] :: [Int]) $ FCDT.problems musicInfo
      _ <- runDB $ insert $
        FCTypingMusic
        (FCDT.title musicInfo)
        (FCDT.musician musicInfo)
        ((map $ T.pack . show) <$> FCDT.genre musicInfo)
        Nothing
        (fromJust mFormat)
        (T.pack $ FCDT.musicSrc musicInfo)
        (T.pack $ FCDT.lyricSrc musicInfo)
        (T.pack <$> FCDT.pictureSrc musicInfo)
        (T.pack jsonPath)
      redirect FCTypingR
    FormFailure text -> do
      $logInfo $ "Post failed."
      $logInfo $ T.pack $ show text
      setMessage "Music Config Data can't be posted."
      redirect $ FCMusicEditorR musicTitle
    FormMissing -> do
      $logInfo $ "Form Missing!"
      setMessage "Music Config Data is Missing."
      redirect $ FCMusicEditorR musicTitle

readLyrics :: FilePath -> IO [Text]
readLyrics path = do
  lyrics <- readFile path
  return $ filter (not . T.null) $ T.lines lyrics
