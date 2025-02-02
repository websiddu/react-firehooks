import { Auth, AuthError, getIdTokenResult, IdTokenResult, onIdTokenChanged } from "firebase/auth";
import { useCallback } from "react";
import { ValueHookResult } from "../common/index.js";
import { useListen, UseListenOnChange } from "../internal/useListen.js";
import { LoadingState } from "../internal/useLoadingValue.js";

export type UseAuthIdTokenResultResult = ValueHookResult<IdTokenResult | null, AuthError>;

/**
 * Returns and updates the deserialized JWT of the currently authenticated user
 *
 * @param {Auth} auth Firebase Auth instance
 * @returns {UseAuthIdTokenResultResult} Deserialized JWT, loading state, and error
 * * value: Deserialized JWT; `undefined` if the JWT is currently being fetched, or an error occurred
 * * loading: `true` while fetching JWT; `false` if the JWT was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useAuthIdTokenResult(auth: Auth): UseAuthIdTokenResultResult {
    const onChange: UseListenOnChange<IdTokenResult | null, AuthError, Auth> = useCallback(
        (stableAuth, next, error) =>
            onIdTokenChanged(stableAuth, async (user) => {
                if (user) {
                    try {
                        // Can also be accessed via `user.accessToken`, but that's not officially documented
                        const idTokenResult = await getIdTokenResult(user);
                        next(idTokenResult);
                    } catch (e) {
                        error(e as AuthError);
                    }
                } else {
                    next(null);
                }
            }),
        []
    );

    return useListen(auth, onChange, () => true, LoadingState);
}
