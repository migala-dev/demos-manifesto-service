const Joi = require('joi');

const { optionTypeEnum } = require('../shared/enums');

const suggestion = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().allow(null, ''),
    optionType: Joi.number().valid(optionTypeEnum.IN_FAVOR_OR_OPPOSSING),
  })
};

module.exports = {
  suggestion
};