import { normalize, schema } from 'normalizr';

const player = new schema.Entity('player');
const playerResponseSchema = new schema.Object({})

/*
-> Player
  - membershipType
  - membershipId
  - displayName
  - iconPath
  - characterIds

-> Character
  - characterId
    - membershipID
    - characterId
    - light
    - classType : String from classHash lookup
    - emblemPath
    - emblemBackgroundPath
    - emblemColor
    - baseCharacterLevel

-> Characters : [Character]

-> Raid -> Filter by mode needs Raid = 4
  - period : Time
  - name: String from directorActivityHash lookup.
  - mode
  - completed: boolean
  - stats { assists: 28 }

-> Raids : [Raid]
 */