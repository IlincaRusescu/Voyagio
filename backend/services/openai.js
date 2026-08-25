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
8. Prefer logical geographic grouping when possible, but detailed route optimization will happen later.
9. If the user prefers hidden gems, include less obvious local places in addition to famous attractions.
10. If the user prefers must-see attractions, prioritize major landmarks.
11. searchQuery must be specific enough for another system to search the place later.
12. Do not invent coordinates, addresses, ratings, opening hours, ticket prices, map URLs or image URLs.
13. Recommendations must be relevant to the destination and user preferences.
14. Top stays should contain up to 3 options unless accommodation recommendations were skipped.
15. Restaurants should be separate from the daily itinerary.
16. The number of activities per day must reflect the user's selected pace.
17. Avoid stacking too many high-intensity indoor cultural activities on the same day.

For museums and similar attractions:
- normally include no more than 1 major museum per day;
- a second museum is acceptable only if it is small, nearby, and the user's culture preference is very high;
- balance museums with outdoor walks, neighborhoods, viewpoints, parks, beaches, shopping, food-related exploration, or other lighter activities;
- even for Packed pace, prioritize variety rather than exhausting repetition.

The result will later be verified and enriched using Google Places and Google Routes.
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

module.exports = {
  generateItineraryDraft
}