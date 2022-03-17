/*
  DEMOS
  Copyright (C) 2022 Julian Alejandro Ortega Zepeda, Erik Ivanov Domínguez Rivera, Luis Ángel Meza Acosta
  This file is part of DEMOS.

  DEMOS is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  DEMOS is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const Joi = require('joi');
const optionTypeEnum = require('../shared/enums/option-type.enum');

const createDraft = {
  body: Joi.object().keys({
    title: Joi.string().allow(null, ''),
    content: Joi.string().allow(null, ''),
    optionType: Joi.number().valid(...Object.values(optionTypeEnum)),
    options: Joi.array()
    .items(
        Joi.object().keys({
            manifestoOptionId: Joi.string().allow(null, ''),
            title: Joi.string().allow(null, ''),
        })
      )
  }),
};

const updateDraft = {
  body: Joi.object().keys({
    title: Joi.string().allow(null, ''),
    content: Joi.string().allow(null, ''),
    optionType: Joi.number().valid(...Object.values(optionTypeEnum)),
    options: Joi.array()
    .items(
        Joi.object().keys({
            manifestoOptionId: Joi.string().allow(null, ''),
            title: Joi.string().allow(null, ''),
        })
      )
  }),
};

const proposal = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().allow(null, ''),
    optionType: Joi.number().valid(...Object.values(optionTypeEnum)),
    options: Joi.array()
    .items(
        Joi.object().keys({
            title: Joi.string().required(),
        })
      )
  }),
};

const voteProposal = {
  body: Joi.object().keys({
    inFavor: Joi.boolean().allow(null),
    manifestoOptionId: Joi.string().allow(null, ''),
    userHash: Joi.string().required(),
    nullVoteComment: Joi.string().allow(null, ''),
  }),
};


module.exports = {
    createDraft,
    updateDraft,
    voteProposal
};
