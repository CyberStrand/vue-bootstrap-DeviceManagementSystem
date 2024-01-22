<template>
    <div id="map"></div>
</template>

<script>

export default {
    mounted(){
        var map =  new AMap.Map('map', {
            viewMode: '3D',
            zoom: 11.8,
            center: [121.304018, 31.217688],
            mapStyle: 'amap://styles/60e7f21d78839b84a2c62e45d194a311',
            showBuildingBlock: false,
            showLabel: false,
        });

        var loca = window.loca = new Loca.Container({
            map,
        });
        
        loca.ambLight = {
            intensity: 2.2,
            color: '#babedc',
        };
        loca.dirLight = {
            intensity: 0.46,
            color: '#d4d4d4',
            target: [0, 0, 0],
            position: [0, -1, 1],
        };
        loca.pointLight = {
            color: 'rgb(15,19,40)',
            position: [121.5043258, 31.2392241, 2600],
            intensity: 25,
            // 距离表示从光源到光照强度为 0 的位置，0 就是光不会消失。
            distance: 3900,
        };
        var geo = new Loca.GeoJSONSource({
            url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/sh_building_center.json',
        });

        var pl = window.pl = new Loca.PolygonLayer({
            zIndex: 120,
            shininess: 10,
            hasSide: true,
            cullface: 'back',
            depth: true,
        });

        pl.setSource(geo);
        pl.setStyle({
            topColor: '#111',
            height: function (index, feature) {
                return feature.properties.h;
            },
            textureSize: [1000, 820],
            texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/windows.jpg',
        });
        pl.setLoca(loca);

        console.log('OK')

        map.on('complete', function () {
            loca.animate.start();
            // document.querySelector('.start-btn').addEventListener('click', function () {
            setTimeout(this.animate, 2000);
        });
    },
    methods:{
      animate(){
            console.log('OK12132')
            var speed = 1;
            // 镜头动画
            map.setZoom(11.8, true);
            map.setPitch(0, true);
            map.setCenter([121.304018, 31.217688], true);
            map.setRotation(1, true);
            pl.hide(1000);

            // 下钻
            loca.viewControl.addAnimates([{
              pitch: {
                value: 0,
                control: [[0, 20], [1, 0]],
                timing: [0, 0, 0.8, 1],
                duration: 3000 / speed,
              },
              zoom: {
                value: 15.9,
                control: [[0, 12.8], [1, 15.9]],
                timing: [0, 0, 0.8, 1],
                duration: 3000 / speed,
              },
              rotation: {
                value: -20,
                control: [[0, 20], [1, -20]],
                timing: [0, 0, 0.8, 1],
                duration: 2000 / speed,
              },
            }], function () {
              setTimeout(function () {
                pl.show(2000);
              }, 3000);

              loca.viewControl.addAnimates([
                // 寻迹
                {
                  center: {
                    value: [121.500419, 31.238089],
                    control: [[121.424503326416,
                               31.199146851153124], [121.46656036376952,
                                                     31.245828642661486]],
                    timing: [0.3, 0, 0.1, 1],
                    duration: 8000 / speed,
                  },
                  zoom: {
                    value: 17,
                    control: [[0.3, 15], [1, 17]],
                    timing: [0.3, 0, 0.7, 1],
                    duration: 4000 / speed,
                  },
                  pitch: {
                    value: 50,
                    control: [[0.3, 0], [1, 50]],
                    timing: [0.3, 0, 1, 1],
                    duration: 3000 / speed,
                  },
                  rotation: {
                    value: -80,
                    control: [[0, -20], [1, -80]],
                    timing: [0, 0, 1, 1],
                    duration: 1000 / speed,
                  },
                }, {
                  // 环绕
                  pitch: {
                    value: 50,
                    control: [[0, 40], [1, 50]],
                    timing: [0.3, 0, 1, 1],
                    duration: 7000 / speed,
                  },
                  rotation: {
                    value: 260,
                    control: [[0, -80], [1, 260]],
                    timing: [0, 0, 0.7, 1],
                    duration: 7000 / speed,
                  },
                  zoom: {
                    value: 17,
                    control: [[0.3, 16], [1, 17]],
                    timing: [0.3, 0, 0.9, 1],
                    duration: 5000 / speed,
                  },
                }, {
                  // 拉起
                  center: {
                    value: [121.500419, 31.238089],
                    control: [[121.49986267089844,
                               31.227628422210365], [121.49969100952148,
                                                     31.24025152837923]],
                    timing: [0.3, 0, 0.7, 1],
                    duration: 2000 / speed,
                  },
                  pitch: {
                    value: 0,
                    control: [[0, 0], [1, 100]],
                    timing: [0.1, 0, 0.7, 1],
                    duration: 2000 / speed,
                  },
                  rotation: {
                    value: 361,
                    control: [[0, 260], [1, 361]],
                    timing: [0.3, 0, 0.7, 1],
                    duration: 2000 / speed,
                  },
                  zoom: {
                    value: 13.8,
                    control: [[0, 17.5], [1, 13.8]],
                    timing: [0.3, 0, 0.7, 1],
                    duration: 2500 / speed,
                  },
                }], function () {
                  pl.hide(1000);
                   setTimeout(animate, 2000);
                  console.log('结束');
              });
          });
      }
    }
}
</script>

<style>

html,body,#map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }

        h1 {
            font-size: 18px;
            margin: 0;
            color: rgb(180, 180, 190);
        }

        h3 {
            font-size: 12px;
            font-weight: normal;
            margin-top: 5px;
            color: rgb(150,150,150);
        }
        .start-btn {
            position: absolute;
            bottom: 20px;
            right: 20px;
            padding: 0 18px;
            height: 30px;
            background-color: #1A66FF;
            border-radius: 5px;
            z-index: 1;
            cursor: pointer;
        }
        .start-btn>a {
            color: #fff;
            display: block;
            height: 100%;
            line-height: 30px;
            text-align: center;
            font-size: 14px;
        }
    
</style>