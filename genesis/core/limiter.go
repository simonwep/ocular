package core

import (
	"sync"
	"time"
)

var (
	failedLoginsMutex sync.Mutex
	failedLogins      = make(map[string]*loginState)
)

type loginState struct {
	FailedAttempts    int64     // Currently failed attempts
	NextPossibleLogin time.Time // Next possible login time
}

func IsLockedOut(id string) (bool, time.Duration) {
	failedLoginsMutex.Lock()
	defer failedLoginsMutex.Unlock()

	st := failedLogins[id]

	if st == nil {
		return false, 0
	}

	if st.NextPossibleLogin.IsZero() {
		return false, 0
	}

	if diff := time.Until(st.NextPossibleLogin); diff > time.Second {
		return true, diff
	}

	st.NextPossibleLogin = time.Time{}
	return false, 0
}

func ApplyFailedAttempt(id string) {
	failedLoginsMutex.Lock()
	defer failedLoginsMutex.Unlock()

	st := failedLogins[id]
	if st == nil {
		st = &loginState{}
		failedLogins[id] = st
	}

	st.FailedAttempts++
	if st.FailedAttempts >= Config.LoginMaxAttempts {
		idx := int(st.FailedAttempts) - int(Config.LoginMaxAttempts)

		// Cap to the max duration index
		if idx >= len(Config.LoginLockDurations) {
			idx = len(Config.LoginLockDurations) - 1
		}

		dur := Config.LoginLockDurations[idx]
		st.NextPossibleLogin = time.Now().Add(dur)
	}
}

func ResetFailedLoginAttempts(id string) {
	failedLoginsMutex.Lock()
	defer failedLoginsMutex.Unlock()
	delete(failedLogins, id)
}

func ResetAllFailedLoginAttempts() {
	failedLoginsMutex.Lock()
	defer failedLoginsMutex.Unlock()
	failedLogins = make(map[string]*loginState)
}
