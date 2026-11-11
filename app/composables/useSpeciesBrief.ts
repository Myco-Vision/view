export interface SpeciesBriefInfo {
  name: string
  classification: string
  confidence: number
  descriptionRest: string
  habitat: string
  reference: string
}

export const SPECIES_BRIEF_CATALOG: Record<string, {
  descriptionRest: string
  habitat: string
  wikiSlug: string
}> = {
  'pleurotus pulmonarius': {
    descriptionRest: ', commonly known as the Indian Oyster, Italian Oyster, or Phoenix Mushroom, is a fungus very similar to Pleurotus ostreatus (the pearl oyster), but with a paler, thinner cap and a preference for warmer weather.',
    habitat: 'Grows in overlapping clusters on decaying hardwood logs and stumps in subtropical and tropical forests.',
    wikiSlug: 'Pleurotus_pulmonarius',
  },
  'pleurotus ostreatus': {
    descriptionRest: ', the oyster mushroom, pearl oyster mushroom, or hiratake, is a common edible mushroom. It is one of the more commonly sought wild mushrooms, though it can also be cultivated on straw and other media.',
    habitat: 'Decaying hardwood logs, dying deciduous trees, and fallen timber.',
    wikiSlug: 'Pleurotus_ostreatus',
  },
  'gymnopilus': {
    descriptionRest: ' is a genus of gilled mushrooms within the fungal family Hymenogastraceae, characterized by rusty-orange spore prints, yellow to reddish-brown caps, and an often bitter taste.',
    habitat: 'Dead wood, decaying hardwood or palm logs, and tree stumps.',
    wikiSlug: 'Gymnopilus',
  },
  'termitomyces': {
    descriptionRest: ' is a genus of basidiomycete fungi belonging to the family Lyophyllaceae. They are a food source for Macrotermitinae, a subfamily of fungus-growing termites, and are prized as choice edible mushrooms across Asia and Africa.',
    habitat: 'Grows symbiotically out of subterranean termite mounds in tropical grasslands and forests.',
    wikiSlug: 'Termitomyces',
  },
  'auricularia': {
    descriptionRest: ' is a genus of fungi in the family Auriculariaceae. Fruit bodies are gelatinous, ear-like to cup-shaped, and grow on wood, where they are saprotrophic on dead and decaying branches.',
    habitat: 'Dead and decaying branches, logs, and moist rotting wood.',
    wikiSlug: 'Auricularia_(fungus)',
  },
  'amanita virosa': {
    descriptionRest: ', commonly known in Europe as the destroying angel, is a deadly poisonous basidiomycete fungus in the genus Amanita. Its white fruit bodies contain amatoxins that cause severe liver and kidney failure.',
    habitat: 'Mixed woodlands and soil near trees.',
    wikiSlug: 'Amanita_virosa',
  },
  'leucocoprinus birnbaumii': {
    descriptionRest: ', commonly known as the plantpot dapperling or yellow houseplant mushroom, is a species of gilled mushroom in the family Agaricaceae. It is common in the tropics and subtropics and frequently appears in potted plants and greenhouses.',
    habitat: 'Potted houseplants, greenhouses, compost piles, and rich garden soil.',
    wikiSlug: 'Leucocoprinus_birnbaumii',
  },
}

export function resolveSpeciesBrief(scan: any): SpeciesBriefInfo {
  const rawName = (scan?.result_name || scan?.name || 'Unknown').trim()
  const rawClass = (scan?.result_classification || scan?.classification || 'unknown').toLowerCase()
  const classification = rawClass.charAt(0).toUpperCase() + rawClass.slice(1)
  const key = rawName.toLowerCase()
  const catalogEntry = SPECIES_BRIEF_CATALOG[key]
  const dbSpecies = scan?.species

  const isUnknownSpecies = key.startsWith('unknown ') || key === 'edible' || key === 'poisonous'
  const fallbackDescRest = isUnknownSpecies
    ? ` — This mushroom was classified as ${classification.toLowerCase()} by the safety model, but its exact species did not match a catalog entry above the confidence threshold.`
    : ' is the identified mushroom species based on your scan.'

  const wikiTarget = catalogEntry?.wikiSlug
    || (isUnknownSpecies ? 'Mushroom' : rawName.replace(/\s+/g, '_'))

  let dbDescRest = ''
  if (dbSpecies?.description) {
    const desc = String(dbSpecies.description).trim()
    const stripped = desc.toLowerCase().startsWith(key)
      ? desc.slice(rawName.length)
      : ` — ${desc}`
    dbDescRest = stripped
  }

  return {
    name: rawName,
    classification,
    confidence: scan?.confidence_level ?? scan?.confidence ?? 0,
    descriptionRest: catalogEntry?.descriptionRest || dbDescRest || fallbackDescRest,
    habitat: dbSpecies?.habitat || catalogEntry?.habitat || '',
    reference: 'https://en.wikipedia.org/wiki/' + encodeURIComponent(wikiTarget),
  }
}
