import { Button } from '@nutui/nutui-react-taro';
import CommonButton from '@/components/CommonButton';
import router from '@/route';
import services from '@/services';

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateShops } from '@/model/features/app';
import createErrorBoundary from '@/pages/layouts';
import styles from './index.module.less';
import { View } from '@tarojs/components';
import { useDidHide, useDidShow, usePullDownRefresh, useReady, useRouter } from '@tarojs/taro';
import { cache, cacheKey } from '@/cache';
import { DEFAULT_LAT_LNG } from '@/utils/constant';
import map from '@/utils/map';
import Tab from './components/Tab';

interface Location {
  latitude: number;
  longitude: number;
  myLatitude?: number;
  myLongitude?: number;
  scale?: number;
}

interface Shop {
  id: string | number;
  latitude: number;
  longitude: number;
  isCanReturn?: boolean;
  isCanRent?: boolean;
  distance?: number;
}
const Index = forwardRef(() => {
  const router = useRouter();
  const dispatch = useDispatch();
  const mapContext = useRef<any>(null);
  const markerContext = useRef<any>(null);
  const currentMarkerContext = useRef<any>(null)

  const [currentShop, setCurrentShop] = useState<Shop | null>(null)
  const locationToList = useRef<Location>({
    ...DEFAULT_LAT_LNG,
    ...cache.get(cacheKey.MY_LOCATION)
  })
  const [changeCount, setChangeCount] = useState(0)

  /**生成地图唯一id */
  const generateUniqueId = () => {
    return `map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  const id = useRef(generateUniqueId());

  /**初始化逻辑 */
  useEffect(() => {
    init()
    return () => {
      mapContext?.current?.off('panend', handleMapPanEnd);
      mapContext?.current?.off('click', handleMapClick);
      markerContext?.current?.off('click');
      mapContext.current = null;
      markerContext.current = null;
    }
  }, []);

  const init = async () => {
    await h5GetMyLocation()
    initH5Map();
    checkVipCodeFromParams();
  }

  /**处理组件显示逻辑 */
  useDidShow(() => {
    // handleComponentShow()
    // return () => handleComponentHide()
  });

  /**组件全部准备好 */
  useReady(() => {

  });

  // 对应 onReady

  // 对应 onShow
  useDidShow(() => { });

  // 对应 onHide
  useDidHide(() => { });

  // Taro 对所有小程序页面生命周期都实现了对应的自定义 React Hooks 进行支持
  // 详情可查阅：【Hooks】
  usePullDownRefresh(() => { });

  // 检查路由参数中的会员码
  const checkVipCodeFromParams = () => {
    // const { shopName, code, ac } = router.params;
    // if (code) {
    // setVipQRCodeInfo({ shopName, code, ac })
    // setIsShowVipActivity(true)
    // }
  };
  /**获取当前位置 */
  const h5GetMyLocation = () => {
    return new Promise<void>(async (resolve) => {
      const { latitude, longitude } = await map.lacateCurrentPosition();
      updateLocationState({ latitude, longitude, myLatitude: latitude, myLongitude: longitude })
      resolve()
    });

  }
  /**H5地图初始化 */
  const initH5Map = () => {
    if (!window || !window.TMap || mapContext.current) return;
    console.log('H5地图初始化', locationToList?.current)
    const center = new TMap.LatLng(locationToList?.current?.latitude, locationToList?.current?.longitude);
    const mapContainer = document.getElementById(id.current) as HTMLElement;
    if (!mapContainer) return;
    mapContext.current = new TMap.Map(mapContainer, {
      center, //设置地图中心点坐标
      zoom: 14, //设置地图缩放级别
      pitch: 43.5, //设置俯仰角
      rotation: 45, //设置地图旋转角度
      showControl: false
    });

    /**添加地图事件监听 */
    mapContext.current?.on('panend', handleMapPanEnd);
    mapContext.current?.on('click', handleMapClick);
  };

  /**位置信息发生变化 */
  useEffect(() => {
    console.log('locationToList.current', locationToList.current, changeCount)
    if (!locationToList.current || !locationToList.current.myLatitude) return
    h5GetMarkerList(locationToList.current)
  }, [locationToList.current, changeCount]);



  // /**获取附近网点 */
  const h5GetMarkerList = useCallback(async (params: Location) => {
    let shops = await services.getShopList(
      Object.assign({ ...params, showDeviceInfo: true }, { loading: false })
    );
    console.log('shops', shops)
    h5PaintMarker(shops);
    // dispatch(updateShops(shops))
  }, [])

  /**h5绘制marker */
  const h5PaintMarker = (options) => {
    if (!options || !options.length) {
      markerContext.current && markerContext.current.setMap(null);
      markerContext.current = null;
      setCurrentShop(null)
      return;
    }
    const markerArr = options.map((item) => {
      return {
        id: item.id,
        position: new TMap.LatLng(item.latitude, item.longitude),
        properties: { ...item },
        styleId:
          currentShop && currentShop.id === item.id
            ? 'activeMarker'
            : 'marker',
        zIndex: currentShop && currentShop.id === item.id ? 10 : 1,
        rank: currentShop && currentShop.id === item.id ? 10 : 1
      };
    });
    if (
      currentShop &&
      markerArr.findIndex((item) => item.id === currentShop.id) === -1
    ) {
      setCurrentShop(null)
    }
    markerContext.current && markerContext.current.setMap(null);
    markerContext.current = new TMap.MultiMarker({
      id: 'marker-layer',
      map: mapContext.current,
      enableCollision: true,
      collisionOptions: { sameSource: true },
      styles: {
        marker: new TMap.MarkerStyle({
          width: 32,
          height: 42,
          src: require('@/assets/images/index/shop.png')
        }),
        activeMarker: new TMap.MarkerStyle({
          width: 42,
          height: 54,
          src: require('@/assets/images/index/shop_s.png')
        })
      },
      geometries: markerArr
    });

    markerContext.current.on('click', (marker) => eventClick(marker));
  }

  /**点击marker */
  const eventClick = async (marker) => {
    // console.log('marker', marker)
    if (currentShop && currentShop.id === marker.geometry.id) {
      clearClickHandle(marker.geometry);
      return;
    }
    currentMarkerContext.current = marker;
    /**保险起见，再查一遍该网点数据，保证正确性 */
    let shopDeal = await services.getShopDetail(marker.geometry.id);
    const markerArr = markerContext.current.geometries.map((item) => {
      return {
        ...item,
        styleId: item.id === marker.geometry.id ? 'activeMarker' : 'marker',
        zIndex: item.id === marker.geometry.id ? 10 : 1,
        rank: item.id === marker.geometry.id ? 10 : 1,
        properties: { ...shopDeal, distance: marker.geometry.properties.distance }
      };
    });
    markerContext.current.setGeometries(markerArr);
    setCurrentShop({ ...shopDeal, distance: marker.geometry.properties.distance })
  }

  /**H5清除点击状态 */
  const clearClickHandle = (marker) => {
    if (!marker) {
      return;
    }
    setCurrentShop(null)
    markerContext.current.updateGeometries([
      {
        ...marker,
        id: marker.id,
        styleId: 'marker'
      }
    ]);
    currentMarkerContext.current = null
  }

  /**处理地图平移结束 */
  const handleMapPanEnd = () => {
    console.log('处理地图平移结束', mapContext.current)
    if (!mapContext.current) return;
    const { lat, lng } = mapContext.current.getCenter();
    updateLocationState({ latitude: lat, longitude: lng })
  };
  // 更新位置状态
  const updateLocationState = (location: Location) => {
    locationToList.current = { ...locationToList.current, ...location }
    setChangeCount((prev) => prev + 1)
    cache.set(cacheKey.MY_LOCATION, location)
  }


  // 处理地图点击
  const handleMapClick = () => {
    if (!currentShop) return;
    currentMarkerContext.current && clearClickHandle(currentMarkerContext.current?.geometry);
  };

  return (
    <View className={styles.container}>
      <View className={styles.mapBox} id={id.current}></View>
      <View className={styles.mapPoint}>
        <img className={styles.centerPoint} src={require('@/assets/images/index/position.png')} />
      </View>
      <Tab isShowOrder={false} />
    </View>
  );
});
export default createErrorBoundary(Index);
