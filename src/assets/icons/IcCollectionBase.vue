<template>
  <svg
    width="66"
    height="79"
    viewBox="0 0 66 79"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_6870_86678)">
      <path
        d="M31.7179 63.7786L33 65.8897L34.2821 63.7786L40.3583 53.7737C48.345 50.7049 54 42.8009 54 33.5676C54 21.697 44.6383 12 33 12C21.3617 12 12 21.697 12 33.5676C12 42.8009 17.6551 50.7049 25.6417 53.7737L31.7179 63.7786Z"
        fill="#F54E4E"
        stroke="white"
        stroke-width="3"
      />
      <g clip-path="url(#clip0_6870_86678)">
        <path
          d="M40.3508 41.4V22.5H25.6508V41.4H23.5508V43.5H42.4508V41.4H40.3508ZM31.9508 24.6H34.0508V26.7H31.9508V24.6ZM31.9508 28.8H34.0508V30.9H31.9508V28.8ZM31.9508 33H34.0508V35.1H31.9508V33ZM29.8508 35.1H27.7508V33H29.8508V35.1ZM29.8508 30.9H27.7508V28.8H29.8508V30.9ZM29.8508 26.7H27.7508V24.6H29.8508V26.7ZM35.1008 41.4H30.9008V39.3C30.9008 38.145 31.8458 37.2 33.0008 37.2C34.1558 37.2 35.1008 38.145 35.1008 39.3V41.4ZM38.2508 35.1H36.1508V33H38.2508V35.1ZM38.2508 30.9H36.1508V28.8H38.2508V30.9ZM38.2508 26.7H36.1508V24.6H38.2508V26.7Z"
          fill="white"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_6870_86678"
        x="-7"
        y="-1"
        width="80"
        height="80"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_6870_86678"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_6870_86678"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_6870_86678">
        <rect
          width="21"
          height="21"
          fill="white"
          transform="translate(22.5 22.5)"
        />
      </clipPath>
    </defs>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: String,
    default: "20"
  },
  height: {
    type: String,
    default: "20"
  },
  color: {
    type: String
  }
});
</script>
