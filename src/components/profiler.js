import * as React from 'react'
import client from 'utils/api-client'
import {PROFILE} from 'constant'

let queue = []

setInterval(sendProfileQueue, 5000)

function sendProfileQueue() {
  if (!queue.length) {
    return Promise.resolve({success: true})
  }
  const queueTosend = [...queue]
  queue = []
  return client(PROFILE, {data: queueTosend})
}

export default function Profiler({phases, metaData, ...props}) {
  function reportProfile(
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions,
  ) {
    if (!phases || phases.includes(phase)) {
      queue.push({
        metaData,
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions: [...interactions],
      })
    }
  }

  return <React.Profiler onRender={reportProfile} {...props}></React.Profiler>
}
