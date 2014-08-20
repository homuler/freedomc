module Handler.FC.Typing.TypingHome where

import Import
import qualified Data.Text as T
import Text.Julius (rawJS)

getFCTypingR :: Handler Html
getFCTypingR = do
  musicList <- runDB $ selectList [] [Asc FCTypingMusicTitle,
                                      Asc FCTypingMusicMusician]
               :: Handler [Entity FCTypingMusic]
  let thumbnails= map
                  (\(Entity musicId musicData) -> $(widgetFile "fc/fc-typing-thumbnail"))
                  musicList
  defaultLayout $ do
    setTitle "Freedom Concerto -Typing Game-"
    $(widgetFile "fc/fc-typing-home")

postFCTypingR :: Handler Html
postFCTypingR = do
  idVal <- runInputPost $ ireq intField "game-id"
  setSession "gameMusicId" $ T.pack $ show idVal
  redirect FCTypingGameR
