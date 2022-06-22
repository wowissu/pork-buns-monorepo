import { useAppStore } from '@/stores/app.store';
import { computed, ref } from 'vue';

export function createVerifyCode (minLength: number, maxLength: number, value = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
  const length = Math.floor(
    Math.random() * (maxLength - minLength + 1) + minLength
  );

  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomPoz = Math.floor(Math.random() * value.length);

    randomString += value.substring(randomPoz, randomPoz + 1);
  }

  return randomString;
}

export function useVerifyCode (minNumber = 10, maxNumber = 15) {
  // for user input
  const verifyKey = ref<string>('');
  const apiStore = useAppStore();

  // for produce the url
  const verifyCode = ref<string>(createVerifyCode(minNumber, maxNumber));
  const verifyUrl = computed(() => {
    const apiUrl = new URL(apiStore.apiUrl);

    apiUrl.pathname = `${apiUrl.pathname.replace(/\/$/, '')}/service/API/VerifyCode/Get`;
    apiUrl.search = `?key=${verifyCode.value}`;

    return apiUrl.toString();
  });

  function reset () {
    verifyKey.value = '';
    verifyCode.value = createVerifyCode(minNumber, maxNumber);

    return verifyCode.value;
  }

  return {
    verifyKey,
    verifyCode,
    verifyUrl,
    reset
  };
}