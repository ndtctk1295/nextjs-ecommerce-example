import { Carousel } from "flowbite-react";
import Image from "next/image";
function SliderComponent() {
  return (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
      <Carousel slideInterval={5000}>
        <Image
          src="/images/default-product-image.png"
          alt="..."
          width={200}
          height={200}
        />
        <Image
          src="/images/default-product-image.png"
          alt="..."
          width={200}
          height={200}
        />
        <Image
          src="/images/default-product-image.png"
          alt="..."
          width={200}
          height={200}
        />
        <Image
          src="/images/default-product-image.png"
          alt="..."
          width={200}
          height={200}
        />
        <Image
          src="/images/default-product-image.png"
          alt="..."
          width={200}
          height={200}
        />
      </Carousel>
    </div>
  );
}
export default SliderComponent;
