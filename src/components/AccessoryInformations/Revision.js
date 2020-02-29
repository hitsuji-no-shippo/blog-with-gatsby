import React from 'react';
import PropTypes from 'prop-types';

const Revision = ({
  separatorMark,
  formatCreationDateStr,
  number,
  remark,
  shouldDisplayFullRemark,
}) => {
  const line  = (() => {
    const items = [];

    if (formatCreationDateStr) {
      items.push(formatCreationDateStr);
    }

    const isStr = str => typeof str === `string`;

    if (isStr(number)) {
      items.push(number)
    }

    if (isStr(remark) && !shouldDisplayFullRemark) {
      items.push(remark.slice(
        0,
        /^[^x01-x7ExA1-xDF]+$/.test(remark) ? 10 : 20)
      );
    }

    return items.length !== 0 ? items.join(separatorMark) : null;
  })();

  return (
    <>
      {line && <><br />{line}</>}
      {shouldDisplayFullRemark && remark && <><br />{remark}</>}
    </>
  );
};

Revision.propTypes = {
  separatorMark: PropTypes.string.isRequired,
  formatCreationDateStr: PropTypes.string,
  number: PropTypes.string,
  remark: PropTypes.string,
  shouldDisplayFullRemark: PropTypes.bool.isRequired,
};

Revision.defaultProps = {
  formatCreationDateStr: null,
  number: null,
  remark: null,
};

export default Revision;
