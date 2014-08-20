module Handler.FC.Typing.MusicList where

import Import

getFCMusicListR :: Handler Html
getFCMusicListR = do
  musicList <- runDB $ selectList [] [Desc FCTypingMusicTitle,
                                      Asc FCTypingMusicMusician]
               :: Handler [Entity FCTypingMusic]
  let musicPairs = zip [1..] musicList :: [(Int, Entity FCTypingMusic)]
  defaultLayout
    $(widgetFile "fc/fc-music-list")
