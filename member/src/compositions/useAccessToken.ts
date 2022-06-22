import { computed, nextTick, readonly } from 'vue';
import dayjs from 'dayjs';
import { datePostFormat } from '@/const/common.const';
import { usePersistenRef } from '@/compositions/usePersistentRef';

export const accessTokenKey = 'access_token';
export const refreshTokenKey = 'refresh_token';

const accessTokenRef = usePersistenRef<{ token: string, expires?: string }>(accessTokenKey, { token: '', expires: undefined });
const refreshTokenRef = usePersistenRef(refreshTokenKey, { token: '' });

export function useAccessToken () {
  const expire = computed(() => accessTokenRef.value?.expires);

  return readonly({
    accessToken: computed(() => accessTokenRef.value?.token),
    refreshToken: computed(() => refreshTokenRef.value?.token),
    expire: expire,
    isExpired: computed(() => isAccessTokenExpired(expire.value)),
    async setToken (token: string, refreshToken: string, expires?: dayjs.ConfigType) {
      accessTokenRef.value = { token, expires: dayjs(expires).format(datePostFormat) };
      refreshTokenRef.value = { token: refreshToken };

      await nextTick();
    },
    removeAccessToken,
    removeRefreshToken,
    removeTokenExpire
  });
}

function removeAccessToken () {
  accessTokenRef.value = { token: '', expires: undefined };
}

function removeRefreshToken () {
  refreshTokenRef.value = { token: '' };
}

export function removeTokenExpire () {
  accessTokenRef.value = Object.assign({}, accessTokenRef.value, { expire: undefined });
}

export function isAccessTokenExpired (expireDate: dayjs.ConfigType = accessTokenRef.value?.expires) {
  if (expireDate === undefined) {
    return false;
  }

  const expireDayjs = dayjs(expireDate);

  return expireDayjs.isValid() ? expireDayjs.isBefore(dayjs()) : true;
}