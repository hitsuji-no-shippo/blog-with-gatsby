#!/bin/bash

set -x

make_link() {
  if [[ ! -e $1 ]]; then
    BASE_DIR=content/blog/${GATSBY_CONFIG_DIRECTORY:-config/gatsby}

    if [[ $1 = "config" ]]; then
      TARGET=${BASE_DIR};
    else
      TARGET=${BASE_DIR}/$1;
    fi

    if [[ ! -e ${TARGET} ]]; then
      echo "There is not ${TARGET}." >&2
      exit 1
    fi

    ln -srv ${TARGET} $1
  fi
}

make_link config
make_link asciidoctor-option.yaml
