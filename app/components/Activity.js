// @flow
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import routes from '../constants/routes';
import styles from './Activity.css';
import { Path } from './Path';

const Rsync = require('rsync');

const DETAIL_STATE = Object.freeze({
  ERROR: 'ERROR',
  INFO: 'INFO',
  FINAL: 'FINAL'
});

type DetailState = $Values<typeof DETAIL_STATE>;

const RESULT_STATE = Object.freeze({
  PROGRESS: 'PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
});

const ResultViewState = Object.freeze({
  [RESULT_STATE.PROGRESS]: 'Backup In Progress',
  [RESULT_STATE.COMPLETED]: 'Backup Completed',
  [RESULT_STATE.CANCELLED]: 'Backup Cancelled',
  [RESULT_STATE.FAILED]: 'Backup Failed'
});

type BackupDetail = {
  state: DetailState,
  text: string
};

type Props = {};
type State = {
  sourceList: Array<string>,
  backupDetails: Array<BackupDetail>,
  showBackupDetails: boolean,
  destination?: string,
  result?: string
};

export default class Activity extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.backupDetailContainerRef = React.createRef();
    this.state = {
      sourceList: [],
      backupDetails: [],
      showBackupDetails: false
    };
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the backupDetails?
    // Capture the scroll position so we can adjust scroll later.
    const { current } = this.backupDetailContainerRef;
    if (
      prevState.backupDetails.length < this.state.backupDetails.length &&
      current
    ) {
      const container = current;
      return container.scrollHeight - container.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { sourceList, destination } = this.state;
    if (
      (prevState.sourceList !== sourceList && !prevState.sourceList.length) ||
      (prevState.destination !== destination && !prevState.destination)
    ) {
      this.setState(() => ({ result: undefined, backupDetails: [] }));
    }
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const container = this.backupDetailContainerRef.current;
      container.scrollTop = container.scrollHeight - snapshot;
    }
  }

  rsyncPid = null;

  onSourceChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const sourceTarget = event.target;
    const { files } = sourceTarget;
    if (files) {
      this.setState(
        state => ({
          sourceList: [
            ...state.sourceList,
            ...Array.from(files).map(({ path }) => path)
          ]
        }),
        () => {
          // Workaround to handle issue related to selecting same file
          // Issue similar to https://github.com/ngokevin/react-file-reader-input/issues/11
          // WorkAorund : https://github.com/ngokevin/react-file-reader-input/issues/11#issuecomment-363484861
          sourceTarget.value = '';
        }
      );
    }
  };

  onDestinationChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const { target } = event;
    if (target.files && target.files[0]) {
      this.setState(
        {
          destination: target.files[0].path
        },
        () => {
          // Workaround to handle issue related to selecting same file
          // Issue similar to https://github.com/ngokevin/react-file-reader-input/issues/11
          // WorkAorund : https://github.com/ngokevin/react-file-reader-input/issues/11#issuecomment-363484861
          target.value = '';
        }
      );
    }
  };

  onSourceItemRemove = i => {
    this.setState(state => {
      const sourceList = [...state.sourceList];
      sourceList.splice(i, 1);
      return { sourceList };
    });
  };

  onDestinationItemRemove = () => {
    this.setState({ destination: undefined });
  };

  startBackup = () => {
    this.setState({
      result: ResultViewState[RESULT_STATE.PROGRESS]
    });

    const { sourceList, destination } = this.state;
    const isWin = process.platform === 'win32';
    const sourcePaths = isWin ? normalizePath(sourceList) : sourceList;
    const destinationPath = isWin
      ? normalizePath([destination])[0]
      : destination;
    const rsync = new Rsync()
      .flags('avh')
      .progress()
      .recursive()
      .executable(isWin ? 'wsl.exe rsync' : 'rsync')
      .source(sourcePaths)
      .destination(destinationPath)
      .debug(true);

    this.rsyncPid = rsync.execute(
      (error, code, cmd) => {
        if (error) {
          console.log('Error in backup', error);
          this.setState(state => ({
            result: ResultViewState[RESULT_STATE.FAILED],
            backupDetails: [
              ...state.backupDetails,
              errorBackupDetail('Backup failed with rsync command:'),
              errorBackupDetail(cmd),
              errorBackupDetail(error)
            ]
          }));
        } else {
          console.log('Done Backup');
          this.rsyncPid = null;
          this.setState(state => ({
            sourceList: [],
            destination: undefined,
            result: ResultViewState[RESULT_STATE.COMPLETED],
            backupDetails: [
              ...state.backupDetails,
              finalBackupDetail('Backup Completed with rsync command:'),
              finalBackupDetail(cmd)
            ]
          }));
        }
      },
      data => {
        console.log('data', data.toString());
        this.setState(state => ({
          backupDetails: [
            ...state.backupDetails,
            infoBackupDetail(data.toString())
          ]
        }));
      },
      data => {
        console.log('error', data.toString());
        this.setState(state => ({
          backupDetails: [
            ...state.backupDetails,
            errorBackupDetail(data.toString())
          ]
        }));
      }
    );
  };

  cancelBackup = () => {
    if (this.rsyncPid) {
      this.rsyncPid.kill();
    }
    this.rsyncPid = null;
    this.setState({ result: ResultViewState[RESULT_STATE.CANCELLED] });
  };

  toggleBackupDetails = () => {
    this.setState(state => ({ showBackupDetails: !state.showBackupDetails }));
  };

  render() {
    const {
      sourceList,
      destination,
      result,
      backupDetails,
      showBackupDetails
    } = this.state;
    return (
      <div className={styles.container} data-tid="container">
        <h2 className={styles['activity-title']}>Welcome To Rsync Backup</h2>
        <div className={styles['activity-container']}>
          <div className={styles['activity-item']}>
            <span className={styles['activity-item-title']}>Source</span>
            {!!sourceList.length && (
              <Path
                sourceList={sourceList}
                onSourceItemRemove={this.onSourceItemRemove}
              />
            )}
            <label className={styles['browse-button']} htmlFor="source-browse">
              <i className="far fa-folder-open" />
              <span>Browse</span>
              <input
                id="source-browse"
                type="file"
                webkitdirectory="true"
                multiple
                onChange={this.onSourceChange}
              />
            </label>
          </div>
          <div className={styles['activity-item']}>
            <span className={styles['activity-item-title']}>Destination</span>
            {!!destination && (
              <Path
                sourceList={[destination]}
                onSourceItemRemove={this.onDestinationItemRemove}
              />
            )}
            <label
              className={styles['browse-button']}
              htmlFor="destination-browse"
            >
              <i className="far fa-folder-open" />
              <span>Browse</span>
              <input
                id="destination-browse"
                type="file"
                webkitdirectory="true"
                multiple
                onChange={this.onDestinationChange}
              />
            </label>
          </div>
          <div className={styles['activity-buttons-container']}>
            <button
              type="button"
              className={styles['browse-button']}
              disabled={!destination || !sourceList.length}
              onClick={this.startBackup}
            >
              Backup
            </button>
            <button
              type="button"
              className={styles['browse-button']}
              disabled={!this.rsyncPid}
              onClick={this.cancelBackup}
            >
              Cancel
            </button>
          </div>

          {result && <div className={styles['result-status']}>{result}</div>}
          {!!backupDetails.length && (
            <div>
              <div
                onClick={this.toggleBackupDetails}
                className={styles['backup-details-title']}
              >
                <i
                  className={`fas ${
                    showBackupDetails
                      ? 'fa-angle-double-down'
                      : 'fa-angle-double-right'
                  }`}
                />
                <span>Backup Details</span>
              </div>
              {showBackupDetails && (
                <div
                  ref={this.backupDetailContainerRef}
                  className={styles['backup-details-container']}
                >
                  {backupDetails.map(
                    ({ state, text }): BackupDetail => (
                      <span
                        key={text}
                        className={`${styles['backup-detail-item']} ${
                          styles[`backup-detail-item-${state}`]
                        }`}
                      >
                        {text}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

function normalizePath(paths: Array<string>): Array<string> {
  return paths.reduce(
    (normalisedPaths: Array<string>, path: string) => [
      ...normalisedPaths,
      `/mnt/${path.replace(/:/g, '').toLowerCase()}`
    ],
    []
  );
}

function infoBackupDetail(detailText) {
  return {
    state: DETAIL_STATE.INFO,
    text: detailText
  };
}

function errorBackupDetail(detailText) {
  return {
    state: DETAIL_STATE.ERROR,
    text: detailText
  };
}

function finalBackupDetail(detailText) {
  return {
    state: DETAIL_STATE.FINAL,
    text: detailText
  };
}
