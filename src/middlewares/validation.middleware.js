const Joi = require('joi');

// ── Sub-schemas ────────────────────────────────────────────────────────────────

const seoSchema = Joi.object({
  title:       Joi.string().max(70).required(),
  description: Joi.string().max(160).required(),
  keywords:    Joi.string().allow('', null),
  canonical:   Joi.string().uri().required(),
  ogImage:     Joi.string().uri().allow('', null),
}).required();

const heroSchema = Joi.object({
  badge:          Joi.string().allow('', null),
  headline:       Joi.string().required(),
  headlineAccent: Joi.string().allow('', null),
  subheadline:    Joi.string().required(),
  trustPoints:    Joi.array().items(Joi.string()).max(6),
}).required();

const quickInfoSchema = Joi.object({
  duration:  Joi.string().allow('', null),
  fees:      Joi.string().allow('', null),
  batchSize: Joi.string().allow('', null),
  mode:      Joi.string().allow('', null),
}).required();

const landingPageSchema = Joi.object({
  slug:          Joi.string().pattern(/^[a-z0-9-]+$/).required(),
  examShortName: Joi.string().required(),
  examFullName:  Joi.string().required(),
  active:        Joi.boolean(),
  displayOrder:  Joi.number().integer(),

  seo:           seoSchema,
  hero:          heroSchema,
  quickInfo:     quickInfoSchema,

  // All other sections are accepted as-is (Mongoose validates structure)
}).unknown(true);

// Partial schema for PUT requests — only validates fields that are present
const landingPageUpdateSchema = Joi.object({
  slug:          Joi.string().pattern(/^[a-z0-9-]+$/),
  examShortName: Joi.string(),
  examFullName:  Joi.string(),
  active:        Joi.boolean(),
  displayOrder:  Joi.number().integer(),
  seo: Joi.object({
    title:       Joi.string().max(70),
    description: Joi.string().max(160),
    keywords:    Joi.string().allow('', null),
    canonical:   Joi.string().uri(),
    ogImage:     Joi.string().uri().allow('', null),
  }),
  hero: Joi.object({
    headline:       Joi.string(),
    subheadline:    Joi.string(),
    badge:          Joi.string().allow('', null),
    headlineAccent: Joi.string().allow('', null),
    trustPoints:    Joi.array().items(Joi.string()),
  }),
}).unknown(true);

// ── Middleware factories ───────────────────────────────────────────────────────

const validateLandingPage = (req, res, next) => {
  const schema = req.method === 'PUT' ? landingPageUpdateSchema : landingPageSchema;
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(d => ({ path: d.path.join('.'), message: d.message })),
    });
  }
  next();
};

module.exports = { validateLandingPage };
