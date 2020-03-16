/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable func-names */
/* eslint-disable prefer-object-spread */
const { getOptions } = require('loader-utils');
const mdx = require('@mdx-js/mdx');
let grayMatter = null;
try {
  grayMatter = require('gray-matter');
} catch(err) {}


module.exports = async function (content) {
  const callback = this.async();

  const { data, content: mdxContent } = grayMatter !== null ? grayMatter(content) : { content, data: {} };

  const options = Object.assign({}, getOptions(this), {
    filepath: this.resourcePath,
  });
  let result;

  // let translatedContent = fs.readFileSync(`${this.resourcePath}.${langCode}`, 'utf8');

  try {
    result = await mdx(mdxContent, options);
  } catch (err) {
    return callback(err);
  }

  const code = `/* @jsx mdx */
  import React from 'react'
  import { mdx } from '@mdx-js/react'
  import { Box } from 'elemental-react'
  ${result
      .replace('return <div {...props}/>', 'return <Box {...props}/>')
      .replace('<MDXLayout ', `<MDXLayout {...${JSON.stringify(data)}} `)}
  `;

  return callback(null, code);
};
