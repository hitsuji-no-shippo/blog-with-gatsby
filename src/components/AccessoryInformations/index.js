import React from 'react';
import PropTypes from 'prop-types';

import { DisqusCommentCount } from 'components/Disqus';

import { formatDate } from 'utils/i18n';
import { formatReadingTime } from 'utils/helpers';
import Author from './Author';
import Revision from './Revision';

const AccessoryInformations = ({revision, timeToRead, disqus, author}) => {
  const separatorMark = ` • `;

  return (
    <>
      <Author {...author} />
      {formatDate(revision.updateDateStr) + separatorMark +
       formatReadingTime(timeToRead)}
      {disqus.show &&
        <DisqusCommentCount
          identifier={disqus.id}
          title={disqus.title}
          slug={disqus.slug}
          prefix={separatorMark}
        />
      }
      {revision.updateDateStr !== revision.creationDateStr &&
        <Revision
          separatorMark={separatorMark}
          formatCreationDateStr={(() => {
            const format = formatDate(revision.creationDateStr);

            return format !== 'Invalid date' ? format : null;
          })()}
          number={revision.number}
          remark={revision.remark}
          shouldDisplayFullRemark={revision.shouldDisplayFullRemark}
        />
      }
    </>
  );
};

AccessoryInformations.propTypes = {
  revision: PropTypes.shape({
    updateDateStr: PropTypes.string.isRequired,
    creationDateStr: PropTypes.string,
    number: PropTypes.string,
    remark: PropTypes.string,
    shouldDisplayFullRemark: PropTypes.bool.isRequired,
  }).isRequired,
  timeToRead: PropTypes.number.isRequired,
  disqus: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
  }).isRequired,
  author: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
    twitter: PropTypes.string,
  }).isRequired,
};

export default AccessoryInformations;
