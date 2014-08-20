module Handler.FC.FCHome where

import Yesod.Auth
import Import
getFCHomeR :: Handler Html
getFCHomeR = do
  maid <- maybeAuthId
  defaultLayout $ do
    setTitle "Freedom Concerto"
    $(widgetFile "fc/home")
