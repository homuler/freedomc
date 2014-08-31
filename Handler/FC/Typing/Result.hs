module Handler.FC.Typing.Result where

import Import
import Yesod.Auth
import Text.Hamlet (shamletFile)
import qualified Data.Text as T
import Data.List (sortBy)
import Data.Maybe
import Text.Julius (rawJS)

  -- JSON Version is not implemented yet.
getFCTypingResultR :: Handler TypedContent
getFCTypingResultR = do
  userOnly <- lookupGetParam "user"
  userId <- case userOnly of
        Just "true" -> maybeAuthId
        _ -> return Nothing
  $logInfo $ T.pack $ show userId
  musicId <- lookupGetParam "musicid"
  case (userId, musicId) of
    (Just uid, Just mid) -> do
      record <- runDB $ do
        mRecord <- getBy $ UniqueTypingRecord
                   (fromText2Id mid)
                   uid
        mTypingRecord <- case mRecord of
          Just (Entity _ mTypingRecord) -> return $ Just mTypingRecord
          _ -> return Nothing
        mUserInfo <- get uid
        mMusicInfo <- get $ fromText2Id mid
        return (mTypingRecord, mUserInfo, mMusicInfo)
      let records = [(1, record)]
          (mTR, mUI, mMI) = record
          played = fromMaybe 0 $ fCTypingRecordPlayed <$> mTR
          highest = fromMaybe 0 $ fCTypingRecordMaxScore <$> mTR
          average = fromMaybe 0 $ fCTypingRecordAverage <$> mTR
      selectRep $ do
        provideRep $ return $(shamletFile "templates/fc/fc-typing-record.hamlet")
        provideRep $ return $ object [ "played" .= played,
                                       "highest" .= highest,
                                       "average" .= average ]
    (_, Just mid) -> do
      records <- runDB $ do
        usersList <- selectList [] []
        typingRecord <- foldr (\x acc -> do
                                  acc' <- acc
                                  let (Entity uid user) = x
                                  tr <- getBy $ UniqueTypingRecord
                                        (fromText2Id mid) uid
                                  case tr of
                                    Just (Entity _ tr') -> return $ (tr', userIdent user):acc'
                                    Nothing -> return acc') (return []) usersList
        mMusicInfo <- get $ fromText2Id mid
        let typingRecordSorted = sortBy
                                 (\(x, _) (y, _) ->
                                   compare
                                   (fCTypingRecordMaxScore y)
                                   (fCTypingRecordMaxScore x)) typingRecord
        return (mMusicInfo, zip [1..] typingRecordSorted)
      selectRep $ do
        provideRep $ return $(shamletFile "templates/fc/fc-typing-record-ranking.hamlet")
        provideRep $ return $ object [ "name" .= name ]
-- must be modified for users to be able to know the others' highest score.
    (Just uid, _) -> do
      recordsRaw <- runDB $ do
        musicInfos <- selectList [] []
        mUserInfo <- get uid
        $logInfo $ T.pack $ show $ userIdent <$> mUserInfo
        mapM (\(Entity mid musicInfo) -> do
                 mRecord <- getBy $ UniqueTypingRecord
                            mid uid
                 case mRecord of
                   Just (Entity _ typingRecord) -> return (Just typingRecord, mUserInfo, Just musicInfo)
                   _ -> return (Nothing, Nothing, Just musicInfo)) musicInfos
      let records = zip [1..] recordsRaw
        --    :: [(Int, (Maybe FCTypingRecord, Maybe User, Maybe FCTypingMusic))]
      selectRep $ do
        provideRep $ return $(shamletFile "templates/fc/fc-typing-record.hamlet")
        provideRep $ return $ object [ "name" .= name ]
    (_, _) -> do
      recordsRaw <- runDB $ do
        musicInfos <- selectList [] []
        mapM (\(Entity mid musicInfo) -> do
                 mTotalRecord <- getBy $ UniqueMusicRecord mid
                 (mTypingRecord, mUserInfo) <- case mTotalRecord of
                   Just (Entity _ record) -> do
                     mUser <- get $ fCTypingMusicRecordUserId record
                     return (Just record, mUser)
                   _ -> return (Nothing, Nothing)
                 return (mTypingRecord, mUserInfo, Just musicInfo)) musicInfos
      let records = zip [1..] recordsRaw
      selectRep $ do
        provideRep $ return $(shamletFile "templates/fc/fc-typing-record-total.hamlet")
        provideRep $ return $ object [ "name" .= name ]
    where name = "Hamlet" :: Text

getFCTypingShowRankingR :: Handler Html
getFCTypingShowRankingR = do
  userOnly <- lookupGetParam "user"
  musicId <- lookupGetParam "musicid"
  let userValue = fromMaybe "false" userOnly
      musicidValue = fromMaybe "0" musicId
  defaultLayout $(widgetFile "fc/fc-typing-ranking")
