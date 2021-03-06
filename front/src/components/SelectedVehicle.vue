<template>
  <div class="selected-vehicle">
    <div class="block">
      <div class="detail">
        <div>
          <div class="provider">
            <img v-if="logoSrc(vehicle.provider)" :src="logoSrc(vehicle.provider)" alt="logo" class="logo">
            {{ vehicle.provider.name }}
          </div>
        </div>
        <div>
          <div v-if="vehicle.type == 'STATION'" class="no-shrink">
            <div class="available-vehicles">
              <span>{{ vehicle.availableVehicles }}</span>&nbsp;{{ $t('selectedVehicle.bikes') }}
            </div>
            <div v-if="vehicle.availableStands && !vehicle.isVirtual" class="available-stands">
              <span>{{ vehicle.availableStands }}</span>&nbsp;{{ $t('selectedVehicle.docks') }}
            </div>
          </div>
          <div v-else class="type-attributes">
            <span class="type">{{ $t(getVehicleTypeKey(vehicle))}}</span>

            <div class="attributes">
              <img v-if="vehicle.attributes && vehicle.attributes.includes('ELECTRIC')" src="../assets/lightning.svg" class="attribute"/>
              <img v-if="vehicle.attributes && vehicle.attributes.includes('GEARS')" src="../assets/cog.svg" class="attribute"/>
            </div>
          </div>
        </div>

      </div>
      <div class="subdetail">
        <div>
          <a v-if="isMobileAndDeeplink('ios')" :href="vehicle.provider.deepLink.ios" class="open-native">
            {{ $t('selectedVehicle.unlockInTheApp') }}&nbsp;
            <external-link-icon />
          </a>
          <a v-if="isMobileAndDeeplink('android')" :href="vehicle.provider.deepLink.android" class="open-native">
            {{ $t('selectedVehicle.unlockInTheApp') }}&nbsp;
            <external-link-icon />
          </a>
          <a v-if="(isComputer && vehicle.provider.app.ios) || (isMobileAndDeeplink('ios', true))" :href="vehicle.provider.app.ios"><img src="../assets/ios-badge.png" alt=""></a>
          <a v-if="(isComputer && vehicle.provider.app.android) || (isMobileAndDeeplink('android', true))" :href="vehicle.provider.app.android"><img src="../assets/android-badge.png" alt=""></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MobileDetect from 'mobile-detect'
import { ExternalLinkIcon } from 'vue-feather-icons'

const md = new MobileDetect(window.navigator.userAgent)

export default {
  components: { ExternalLinkIcon },
  props: ['vehicle'],
  data: () => ({
    detail: false,
    isAndroid: md.is('AndroidOS'),
    isiOs: md.is('iOS'),
    isComputer: md.phone() === null && md.tablet() === null
  }),
  methods: {
    ...mapActions(['selectVehicle']),
    getVehicleTypeKey(vehicle) {
      let key = `vehicleType.${vehicle.type}`

      if (vehicle.type === 'STATION' && vehicle.isVirtual) {
        return 'vehicleType.VIRTUAL_STATION'
      }

      if (vehicle.attributes && vehicle.attributes.includes('CARGO')) {
        return 'vehicleType.CARGO'
      }

      if (vehicle.attributes && vehicle.attributes.includes('TANDEM')) {
        return 'vehicleType.TANDEM'
      }

      return key
    },
    logoSrc(provider) {
      let logo
      try {
        logo = require(`../assets/providers/${provider.slug}.jpg`)
      } catch (e) {

      }

      return logo
    },
    isMobileAndDeeplink(os, shouldMissingDeeplink) {
      const isMobile = md.is(os === 'android' ? 'AndroidOS': 'iOS')
      const deeplink = (shouldMissingDeeplink) ? !this.vehicle.provider.deepLink[os] : this.vehicle.provider.deepLink[os]
      return  isMobile && deeplink
    }
  }
}
</script>

<style lang="scss">
@import '../app.scss';

$border-radius: 5px;

.selected-vehicle {
  position: absolute;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  width: 100%;
  bottom: 0;
  z-index: 817;

  .no-shrink {
    flex-shrink: 0;
    line-height: 22px;
  }

  .block {
    background-color: $mainColor;
    color: #fff;

    width: 100%;
    max-width: 400px;

    border-radius: $border-radius;
    margin: 0 10px 10px;

    display: flex;
    flex-direction: column;

    .detail {
      padding: 10px;

      display: flex;
      justify-content: space-between;
      flex-direction: row;
      align-items: center;

      .provider {
        font-size: 2.6rem;
        font-weight: bold;
        align-items: center;
        display: flex;
      }

      .logo {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }

      .type-attributes {
        font-weight: bold;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        font-size: 1.8rem;

        .attributes {
          display: flex;

          .attribute {
            padding-left: 5px;
            height: 20px;
          }
        }
      }

      .available-vehicles {
        font-size: 1.6rem;

        span {
          font-weight: bold;
          font-size: 2.2rem;
        }
      }

      .available-stands {
        font-size: 1.2rem;

        span {
          font-weight: bold;
          font-size: 1.8rem;
        }
      }
    }

    .subdetail {
      padding: 10px 10px;
      border-bottom-left-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
      background-color: lighten($mainColor, 20%);

      display: flex;
      justify-content: space-between;
      flex-direction: row-reverse;

      .open-native {
        color: $mainColor;
        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
        background: #fff;
        border-radius: $border-radius;
        text-decoration: none;
        font-weight: bold;
        padding: 10px 20px;
        display: flex;
      }
    }
  }
}
</style>
