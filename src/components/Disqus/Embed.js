import React from 'react';
import PropTypes from 'prop-types';

import { DiscussionEmbed } from 'disqus-react';

import { formatMessage } from 'utils/i18n';
import Disqus from './Disqus';

const Embed = ({identifier, title, slug }) => {
  return (
    <details open>
      <summary>Comments</summary>
      <a href="http://www.paulgraham.com/disagree.html"
        target="_blank"
        rel="external noopener noreferrer"
      >
        {formatMessage('tHowToDisagree')}
      </a>
      <Disqus
        identifier={identifier}
        title={title}
        slug={slug}
        Component={DiscussionEmbed}
      />
    </details>
  );
}

Embed.propTypes = {
  identifier: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
}

export default Embed;
