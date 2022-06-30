<script setup lang="ts">
import MemberContentLayout from '@/layouts/MemberContentLayout.vue';
import ProvinceSelect from '@/components/common/ProvinceSelect.vue';
import { useMemberStore } from '@/stores/member.store';
import type { Member, MemberEditPostdata } from '@pork-buns/core/types/member';
import { reactive, ref, watch } from 'vue';
import { GenderEnum } from '@pork-buns/core/const/common.const';
import { QForm, QSelect } from 'quasar';
import { useRule } from '@pork-buns/core/compositions/useRule';

type UserInput = Partial<Pick<MemberEditPostdata, 'NickName' | 'Sex' | 'BirthDay' | 'QQ' | 'ProvinceID' | 'Address' | 'UserIdentity' | 'Name'>>;

const memberStore = useMemberStore();
const $rules = useRule();
const hasName = ref(false);
const hasBirthday = ref(false);
const hasUserIdentity = ref(false);
const formRef = ref<QForm>();

const sexOptions = [
  {
    label: '请选择',
    value: GenderEnum.Unknown,
    disable: true
  },
  {
    label: '男',
    value: GenderEnum.Male
  },
  {
    label: '女',
    value: GenderEnum.Female
  }
];

const userinput = reactive<UserInput>({
  NickName: undefined,
  Name: undefined,
  Sex: GenderEnum.Unknown,
  BirthDay: undefined,
  QQ: undefined,
  ProvinceID: undefined,
  Address: undefined,
  UserIdentity: undefined
});

watch(() => memberStore.member, (member: Member) => {
  userinput.NickName = userinput.NickName || member.NickName || undefined;
  userinput.Name = userinput.Name || member.Name || undefined;
  userinput.BirthDay = userinput.BirthDay || member.BirthDay || undefined;
  userinput.UserIdentity = member.UserIdentity || undefined;
  userinput.Sex = userinput.Sex || member.Sex || GenderEnum.Unknown;
  userinput.QQ = userinput.QQ || member.QQ || undefined;
  userinput.ProvinceID = userinput.ProvinceID || member.ProvinceID || undefined;

  hasName.value = Boolean(member.Name);
  hasBirthday.value = Boolean(member.BirthDay);
  hasUserIdentity.value = Boolean(member.UserIdentity);
}, { deep: true, immediate: true });

/** 由第一個字母判斷使用香港或者中國驗證方式 */
function identityRules () {
  return (val: string) => {
    return RegExp(/^\p{L}/, 'u').test(val) ? $rules.hkId()(val) : $rules.chinaId()(val);
  };
}

async function submit () {
  const v = await formRef.value?.validate();

  if (!v) {
    return;
  }

  void memberStore.changeUserInfo({
    Sex: userinput.Sex,
    Name: userinput.Name!,
    BirthDay: userinput.BirthDay!,
    UserIdentity: userinput.UserIdentity!,
    QQ: userinput.QQ!,
    NickName: userinput.NickName ?? '',
    ProvinceID: userinput.ProvinceID,
    Address: userinput.Address
  });
}

</script>

<template>
  <MemberContentLayout title="信息设置">
    <q-card-section>
      <q-form ref="formRef" class="tw-max-w-[600px]" @submit="submit">
        <table class="tw-w-full tw-border-separate tw-border-spacing-x-4 tw-border-spacing-y-2 tw-text-lg tw-font-normal">
          <tbody>
            <tr class="tw-align-baseline">
              <td class="tw-text-right">
                用戶名
              </td>
              <td>
                <q-input
                  :model-value="memberStore.member?.Account"
                  outlined
                  dense
                  readonly
                  hint=""
                />
              </td>
            </tr>
            <tr class="tw-align-baseline">
              <td class="tw-text-right">
                姓名
              </td>
              <td>
                <template v-if="hasUserIdentity">
                  <q-input
                    :model-value="memberStore.member?.Name"
                    outlined
                    dense
                    readonly
                    hint=""
                  />
                </template>
                <template v-else>
                  <q-input
                    v-model.trim="userinput.Name"
                    outlined
                    dense
                    :rules="[$rules.required(), identityRules()]"
                    lazy-rules
                    hint="仅有一次设置机会，提款人姓名须与注册姓名一致"
                  />
                </template>
              </td>
            </tr>
            <tr class="tw-align-baseline">
              <td class="tw-text-right">
                公民身份证号
              </td>
              <td>
                <template v-if="hasUserIdentity">
                  <q-input
                    :model-value="memberStore.member?.UserIdentity"
                    outlined
                    dense
                    readonly
                    hint=""
                  />
                </template>
                <template v-else>
                  <q-input
                    v-model.trim="userinput.UserIdentity"
                    outlined
                    dense
                    :rules="[$rules.required(), identityRules()]"
                    lazy-rules
                    hint="香港用户请输入检核码，例：A123456(3)"
                  />
                </template>
              </td>
            </tr>
            <tr class="tw-align-baseline">
              <td class="tw-text-right">
                昵称
              </td>
              <td>
                <q-input
                  v-model.trim="userinput.NickName"
                  outlined
                  dense
                  placeholder="昵称"
                  :rules="[$rules.required()]"
                  hint=""
                />
              </td>
            </tr>
            <tr class="tw-align-baseline">
              <td class="tw-text-right">
                性别
              </td>
              <td>
                <q-select
                  v-model="userinput.Sex"
                  outlined
                  dense
                  :options="sexOptions"
                  emit-value
                  map-options
                  option-label="label"
                  option-value="value"
                  :rules="[$rules.min(0, $t('rules.required'))]"
                  hint=""
                />
              </td>
            </tr>
            <tr class="tw-align-baseline">
              <td class="tw-text-right">
                出生日期
              </td>
              <td>
                <q-input
                  v-model="userinput.BirthDay"
                  mask="####/##/##"
                  fill-mask="_"
                  outlined
                  dense
                  :readonly="hasBirthday"
                  placeholder="出生日期"
                  hint="仅有一次设置机会，设置后当月给您发放礼物"
                  :hide-hint="hasBirthday"
                  :rules="[$rules.isDate(), $rules.required()]"
                >
                  <template #append>
                    <q-icon v-if="!hasBirthday" name="mdi-calendar" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="userinput.BirthDay">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </td>
            </tr>
            <tr class="tw-align-baseline">
              <td class="tw-text-right">
                QQ号码
              </td>
              <td>
                <q-input
                  v-model.trim="userinput.QQ"
                  outlined
                  dense
                  readonly
                  :placeholder="memberStore.member?.QQ"
                  hint=""
                  :rules="[$rules.QQ()]"
                />
              </td>
            </tr>
            <tr class="tw-align-baseline">
              <td class="tw-text-right">
                收货住址
              </td>
              <td>
                <ProvinceSelect
                  v-model="userinput.ProvinceID"
                  dense
                  hint="选填"
                />
              </td>
            </tr>
            <tr class="tw-align-baseline">
              <td class="tw-text-right">
                详细街道
              </td>
              <td>
                <q-input
                  v-model.trim="userinput.Address"
                  outlined
                  dense
                  placeholder="街道地址"
                  hint="选填"
                />
              </td>
            </tr>
            <tr class="tw-align-baseline">
              <td class="tw-text-right" />
              <td>
                <div class="tw-pt-8">
                  <q-btn type="submit" color="primary" class="tw-w-full">
                    保存信息
                  </q-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </q-form>
    </q-card-section>
  </MemberContentLayout>
</template>
