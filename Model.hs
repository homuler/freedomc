module Model where

import Prelude
import Yesod
import Data.Text (Text)
import Database.Persist.Quasi
import Data.Typeable (Typeable)
import Prelude (Show, Int, Double)
import FC.Persistent

-- You can define all of your database entities in the entities file.
-- You can find more information on persistent and how to declare entities
-- at:
-- http://www.yesodweb.com/book/persistent/
share [mkPersist sqlOnlySettings, mkMigrate "migrateAll"]
    $(persistFileWith lowerCaseSettings "config/models")

instance ToJSON FCTypingRecord where
  toJSON
    (FCTypingRecord mid uid score correct miss speed solved maxSpeed maxCombo) =
    object ["musicId" .= (fromId2Text mid), "userId" .= (fromId2Text uid),
            "score" .= score, "correct" .= correct,
            "miss" .= miss, "speed" .= speed,
            "solved" .= solved, "max-spped" .= maxSpeed,
            "max-combo" .= maxCombo]
