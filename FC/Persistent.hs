module FC.Persistent where

import Prelude
import Yesod
import qualified Data.Text as T

fromId2Text :: KeyBackend a b -> T.Text
fromId2Text (Key (PersistInt64 x)) = T.pack $ show x
fromId2Text (Key _) = error "undefined"

fromText2Id :: T.Text -> KeyBackend a b
fromText2Id idNum = Key (PersistInt64 $ read $ T.unpack idNum)

