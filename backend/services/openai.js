const OpenAI = require('openai')

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function generateItineraryDraft(tripForm) {
  const response = await client.responses.create({
    model: 'gpt-5.6-luna',

    instructions: `
You are the AI travel planner for Voyagio.

Your job is to create a highly personalized travel itinerary based on the user's form.

IMPORTANT RULES:

1. Respect all user preferences from the form.

2. Respect the selected travel pace.

3. Arrival and departure days must be lighter:
   - maximum one major attraction;
   - prefer walks, viewpoints, easy exploration or relaxation.

4. Do not schedule meals inside the daily itinerary.
   Restaurants belong only in the restaurants section.

5. Use morning, afternoon, evening or night instead of imposing exact times.

6. Choose realistic visit durations.

7. Match the number and density of activities to the user's selected pace:
   - Relaxed: fewer activities, more downtime, slower transitions.
   - Balanced: a comfortable mix of activities and free time.
   - Packed: prioritize seeing many relevant places and keeping the user active throughout the day, while still keeping travel times and visit durations realistic.

8. Prefer logical geographic grouping when possible, but detailed geographic optimization will happen later using verified coordinates.

9. If the user prefers hidden gems, include less obvious local places in addition to famous attractions.

10. If the user prefers must-see attractions, prioritize major landmarks.

11. searchQuery is used directly with Google Places and must identify one real place or geographic area.

For searchQuery:
- Use the canonical place or area name followed by the destination city.
- Keep it short and factual.
- Do not include descriptive words such as:
  "walking route",
  "photography walk",
  "tickets",
  "official visitor attraction",
  "sunset walk",
  "local streets",
  "things to do",
  "visit",
  or similar phrases.
- For neighborhoods or geographic areas, use only the canonical neighborhood or area name plus the destination city.
- For landmarks, museums, hotels and restaurants, use the real establishment or attraction name plus the destination city.
- When an attraction has a specific official or visitor-facing name, use that exact attraction name instead of a broader institution, complex, district or commonly confused place.
- searchQuery must identify the physical place in Google Places, not describe what the user will do there.
- Do not combine multiple different places into one searchQuery.
- Every activity must have one primary physical location that can be represented by one Google Places result.

Examples:
GOOD: "Gothic Quarter Barcelona"
GOOD: "Park Güell Barcelona"
GOOD: "Sagrada Família Barcelona"
GOOD: "Plaça del Sol Barcelona"
GOOD: "Recinte Modernista de Sant Pau Barcelona"

BAD: "Gothic Quarter Barcelona photography walk"
BAD: "Park Güell monumental zone tickets viewpoints"
BAD: "Sagrada Família official visitor attraction interior towers tickets"
BAD: "Hospital de Sant Pau Barcelona"
BAD: "Barceloneta Beach to Bogatell Beach Barcelona"

12. Do not invent coordinates, addresses, ratings, opening hours, ticket prices, map URLs or image URLs.
   These will be added or verified later by external providers.

13. Recommendations must be relevant to the destination and user preferences.

14. Top stays should contain up to 3 options unless accommodation recommendations were skipped.

15. Restaurants must remain separate from the daily itinerary.

16. The number of activities per day must reflect the user's selected pace.

17. Avoid stacking too many high-intensity indoor cultural activities on the same day.

18. Every activity should represent a clear, distinct stop or area.
   Do not create vague activities that combine several distant locations into one item.

For museums and similar attractions:
- normally include no more than 1 major museum per day;
- a second museum is acceptable only if it is small, nearby, and the user's culture preference is very high;
- balance museums with outdoor walks, neighborhoods, viewpoints, parks, beaches, shopping, food-related exploration, or other lighter activities;
- even for Packed pace, prioritize variety rather than exhausting repetition.

The result will later be:
1. verified and enriched using Google Places;
2. geographically optimized using verified coordinates;
3. enriched with Google Routes between the final consecutive activities.
`,

    input: `
Create the first draft of this Voyagio itinerary.

USER TRIP FORM:

${JSON.stringify(tripForm, null, 2)}
`,

    text: {
      format: {
        type: 'json_schema',
        name: 'voyagio_itinerary_draft',
        strict: true,

        schema: {
          type: 'object',

          properties: {
            overview: {
              type: 'object',

              properties: {
                title: {
                  type: 'string'
                },

                subtitle: {
                  type: 'string'
                },

                summary: {
                  type: 'string'
                },

                highlights: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                }
              },

              required: [
                'title',
                'subtitle',
                'summary',
                'highlights'
              ],

              additionalProperties: false
            },

            stays: {
              type: 'array',

              items: {
                type: 'object',

                properties: {
                  name: {
                    type: 'string'
                  },

                  searchQuery: {
                    type: 'string'
                  },

                  matchType: {
                    type: 'string',
                    enum: [
                      'Best Match',
                      'Best Value',
                      'Great Alternative'
                    ]
                  },

                  whyRecommended: {
                    type: 'string'
                  }
                },

                required: [
                  'name',
                  'searchQuery',
                  'matchType',
                  'whyRecommended'
                ],

                additionalProperties: false
              }
            },

            days: {
              type: 'array',

              items: {
                type: 'object',

                properties: {
                  dayNumber: {
                    type: 'integer'
                  },

                  date: {
                    type: 'string'
                  },

                  title: {
                    type: 'string'
                  },

                  theme: {
                    type: 'string'
                  },

                  isArrivalDay: {
                    type: 'boolean'
                  },

                  isDepartureDay: {
                    type: 'boolean'
                  },

                  activities: {
                    type: 'array',

                    items: {
                      type: 'object',

                      properties: {
                        activityId: {
                          type: 'string'
                        },

                        name: {
                          type: 'string'
                        },

                        searchQuery: {
                          type: 'string'
                        },

                        category: {
                          type: 'string',
                          enum: [
                            'landmark',
                            'museum',
                            'neighborhood',
                            'experience',
                            'nature',
                            'beach',
                            'viewpoint',
                            'shopping',
                            'nightlife',
                            'entertainment',
                            'photography',
                            'relaxation',
                            'other'
                          ]
                        },

                        timeOfDay: {
                          type: 'string',
                          enum: [
                            'morning',
                            'afternoon',
                            'evening',
                            'night'
                          ]
                        },

                        duration: {
                          type: 'object',

                          properties: {
                            minMinutes: {
                              type: 'integer'
                            },

                            maxMinutes: {
                              type: 'integer'
                            }
                          },

                          required: [
                            'minMinutes',
                            'maxMinutes'
                          ],

                          additionalProperties: false
                        },

                        whyRecommended: {
                          type: 'string'
                        },

                        notes: {
                          type: 'string'
                        }
                      },

                      required: [
                        'activityId',
                        'name',
                        'searchQuery',
                        'category',
                        'timeOfDay',
                        'duration',
                        'whyRecommended',
                        'notes'
                      ],

                      additionalProperties: false
                    }
                  }
                },

                required: [
                  'dayNumber',
                  'date',
                  'title',
                  'theme',
                  'isArrivalDay',
                  'isDepartureDay',
                  'activities'
                ],

                additionalProperties: false
              }
            },

            restaurants: {
              type: 'array',

              items: {
                type: 'object',

                properties: {
                  name: {
                    type: 'string'
                  },

                  searchQuery: {
                    type: 'string'
                  },

                  cuisine: {
                    type: 'string'
                  },

                  recommendationType: {
                    type: 'string'
                  },

                  whyRecommended: {
                    type: 'string'
                  },

                  reservationRecommended: {
                    type: 'boolean'
                  }
                },

                required: [
                  'name',
                  'searchQuery',
                  'cuisine',
                  'recommendationType',
                  'whyRecommended',
                  'reservationRecommended'
                ],

                additionalProperties: false
              }
            },

            beforeYouGo: {
              type: 'object',

              properties: {
                bookAhead: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                },

                gettingAround: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                },

                localTips: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                },

                packingTips: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                }
              },

              required: [
                'bookAhead',
                'gettingAround',
                'localTips',
                'packingTips'
              ],

              additionalProperties: false
            }
          },

          required: [
            'overview',
            'stays',
            'days',
            'restaurants',
            'beforeYouGo'
          ],

          additionalProperties: false
        }
      }
    }
  })

  return JSON.parse(response.output_text)
}


async function optimizeItineraryByCoordinates(itinerary) {
  const response = await client.responses.create({
    model: 'gpt-5.6-luna',

    instructions: `
You are optimizing an already generated Voyagio itinerary using verified coordinates.


IMPORTANT RULES:

1. Do NOT invent new places.

2. Do NOT remove places.

3. Do NOT duplicate places.

4. Do NOT change verified factual data.

5. Keep every original activityId unchanged.

6. Work only with the activities already present in the itinerary.

7. The main goal is to improve the geographic logic and order of the itinerary, not to minimize travel distance at all costs.

8. Primarily optimize the order of activities inside each existing day.

9. You may move an activity between normal sightseeing days ONLY when there is a clear problem with the original grouping, such as:
   - major unnecessary backtracking;
   - repeatedly crossing the same part of the city;
   - an obviously illogical geographic split;
   - another day containing a much more natural geographic continuation.

10. Do NOT move activities between days simply because another arrangement would produce slightly shorter travel times.

11. Preserve the original day structure whenever it already makes reasonable sense.

12. Arrival and departure days are protected:
   - keep them light and flexible;
   - do not move normal sightseeing activities into them;
   - do not move activities out of them unless absolutely necessary;
   - maintain the original arrival/departure character of the day.

13. Create a generally logical direction of travel inside each day:
   - group nearby places when this makes sense;
   - avoid obvious unnecessary backtracking;
   - avoid sending the user to one part of the city, then back toward an area already visited, then out again;
   - prefer a sequence that feels natural to follow.

14. Do NOT over-optimize geographic proximity.
    Activities do not all need to be located very close to one another.

15. Longer transfers are acceptable when they make sense in the overall experience.

16. For Packed itineraries:
   - preserve a high activity density;
   - keep the user active and seeing many relevant places;
   - do not reduce the number of activities just to make every stop geographically close;
   - a day may include several different areas if the sequence is still logical;
   - longer transfers are acceptable when they help include valuable activities;
   - do not turn Packed days into short clusters of only 3 or 4 nearby places unless that genuinely fits the original itinerary.

17. For Balanced itineraries:
   - keep a comfortable and varied number of activities;
   - longer transfers are acceptable when they connect worthwhile experiences;
   - do not force all activities into the same small area;
   - avoid unnecessary backtracking or inefficient zig-zag movement;
   - prioritize a smooth and comfortable daily flow, not minimum travel distance.

18. For Relaxed itineraries:
   - keep fewer activities and more breathing room between them;
   - longer transfers are acceptable when they lead to worthwhile experiences;
   - do not force all activities into the same small area;
   - avoid only unnecessary backtracking or inefficient zig-zag movement;
   - prioritize a calm daily rhythm, not minimum travel distance.

19. Respect the chronological timeOfDay order inside each day:
    morning → afternoon → evening → night.

20. Never place:
    - a morning activity after an afternoon activity;
    - an afternoon activity after an evening activity;
    - an evening activity after a night activity.

21. Do NOT change an activity's timeOfDay.

22. Respect realistic visit durations.

23. Keep each day's activity density appropriate for the original itinerary and selected travel pace.

24. Do not create one extremely overloaded day and another nearly empty day.

25. Avoid stacking too many major museums or high-intensity indoor cultural attractions on the same day.

26. Consider the experience itself, not only the map.
    For example:
    - a viewpoint may intentionally be placed in the evening;
    - a beach may be better later in the day;
    - a major attraction may be better kept in the morning;
    - a longer transfer can be worthwhile if the destination is especially relevant to the user's preferences.

27. Geographic optimization must never destroy a meaningful time-of-day choice just to shorten the route.

28. The itinerary should feel efficient, but also varied and enjoyable.

29. Do not turn every day into a single small geographic cluster.
    Visiting different parts of the destination is expected, especially for Packed itineraries.

30. The final goal is:
    - logical movement;
    - limited unnecessary backtracking;
    - realistic daily flow;
    - strong use of the user's available time;
    - preservation of important experiences and priorities.

31. Return ALL original activities exactly once.

32. Return the final activityId assignment and order for every day.

Do not return explanations outside the required structured output.

`
,
    input: `
Reorder the activities inside each day using their verified coordinates.

ITINERARY:

${JSON.stringify(itinerary, null, 2)}
`,

    text: {
      format: {
        type: 'json_schema',
        name: 'voyagio_optimized_itinerary',
        strict: true,

        schema: {
          type: 'object',

          properties: {
            days: {
              type: 'array',

              items: {
                type: 'object',

                properties: {
                  dayNumber: {
                    type: 'integer'
                  },

                  activityOrder: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  }
                },

                required: [
                  'dayNumber',
                  'activityOrder'
                ],

                additionalProperties: false
              }
            }
          },

          required: [
            'days'
          ],

          additionalProperties: false
        }
      }
    }
  })

  return JSON.parse(response.output_text)
}

module.exports = {
  generateItineraryDraft,
  optimizeItineraryByCoordinates
}