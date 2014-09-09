module Handler.FC.Typing.MusicList where

import Import

getFCMusicListR :: Handler Html
getFCMusicListR = do
  musicList <- runDB $ selectList [] [Desc FCMusicDataTitle,
                                      Asc FCMusicDataMusician]
               :: Handler [Entity FCMusicData]
  let musicPairs = zip [1..] musicList :: [(Int, Entity FCMusicData)]
  defaultLayout
    $(widgetFile "fc/fc-music-list")
