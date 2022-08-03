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

const { optionTypeEnum } = require('../shared/enums');

const suggestion = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().allow(null, ''),
    optionType: Joi.number().valid(optionTypeEnum.SUGGESTION_TO_PROPOSAL),
  })
};

module.exports = {
  suggestion
};