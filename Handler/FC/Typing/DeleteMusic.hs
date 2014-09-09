module Handler.FC.Typing.DeleteMusic where

import Import

postFCDeleteMusicR :: Text -> Handler Html
postFCDeleteMusicR numId = do
  let deleteId = fromText2Id numId :: FCMusicDataId
  runDB $ delete deleteId
  redirect FCMusicListR
