module Handler.FC.Typing.TypingHome where

import Import
import qualified Data.Text as T
import qualified FC.Typing.IO as FCTI
import Text.Julius (rawJS)

getFCTypingR :: Handler Html
getFCTypingR = do
  musicList <- runDB $ selectList [] [Asc FCMusicDataTitle,
                                      Asc FCMusicDataMusician]
               :: Handler [Entity FCMusicData]
  thumbnails <- foldr (\(Entity mid musicData) acc -> do
                          mTypingMusicData <- runDB $ getBy $ UniqueMusic mid
                          acc' <- acc
                          return ($(widgetFile "fc/fc-typing-thumbnail"):acc'))
                (return []) musicList
  defaultLayout $ do
    setTitle "Freedom Concerto -Typing Game-"
    $(widgetFile "fc/fc-typing-home")

postFCTypingR :: Handler Html
postFCTypingR = do
  idVal <- runInputPost $ ireq intField "game-id"
  setSession "gameMusicId" $ T.pack $ show idVal
  redirect FCTypingGameR
