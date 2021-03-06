module FC.Bootstrap3 where

import Yesod.Form.Types
import Text.Shakespeare.I18N
import Data.Maybe

bootstrapFieldSettings :: SomeMessage master -> FieldSettings master
bootstrapFieldSettings msg =
  FieldSettings {fsLabel = msg,
                 fsTooltip = Nothing,
                 fsId = Nothing,
                 fsName = Nothing,
                 fsAttrs = [("class", "form-control")] }

readOnlyFieldSettings :: SomeMessage master -> FieldSettings master
readOnlyFieldSettings msg =
  FieldSettings { fsLabel = msg,
                  fsTooltip = Nothing,
                  fsId = Nothing,
                  fsName = Nothing,
                  fsAttrs = [("readonly", "")] }

hiddenFieldSettings :: SomeMessage master -> FieldSettings master
hiddenFieldSettings msg =
  FieldSettings { fsLabel = msg,
                  fsTooltip = Nothing,
                  fsId = Nothing,
                  fsName = Nothing,
                  fsAttrs = [("hidden", "")] }
