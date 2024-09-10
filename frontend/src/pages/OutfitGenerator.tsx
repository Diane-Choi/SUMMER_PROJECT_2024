import ItemsGrid from '../components/ItemsGrid';
import Button from '../components/ui/Button';
import { InputProps } from '../components/ui/Input';
import { useEffect, useState } from 'react';
import { clothingCategory } from '../components/ItemCard';
import InputGroup from '../components/ui/InputGroup';
import { fetchAIRecommendation } from '../utils/api/ai';
import { saveFavouriteItems } from '../stores/features/favouriteItems';
import { useAppDispatch, useAppSelector } from '../stores/store';
import { ClosetItem, fetchClosetItems } from '../stores/features/closetItems';
import { clearToast, setToast } from '../stores/features/toast';
import Dropdown from '../components/ui/Dropdown';
import { addRecentlyViewedItems } from '../stores/features/recentlyViewedItems';

export const categories: InputProps[] = [
  { id: 'top', type: 'checkbox', label: 'TOP' },
  { id: 'bottom', type: 'checkbox', label: 'BOTTOM' },
  { id: 'outer', type: 'checkbox', label: 'OUTER' },
  { id: 'shoes', type: 'checkbox', label: 'SHOES' },
  { id: 'bag', type: 'checkbox', label: 'BAG' },
  { id: 'accessories', type: 'checkbox', label: 'ACCESSORIES' },
];

export default function OutfitGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<string>('top');
  const [selectedCategoryCheckbox, setCategoryCheckbox] = useState<
    string | string[]
  >([]);
  const [selectedItem, setSelectedItem] = useState<ClosetItem | null>(null);
  const [fetchedGeneratedItems, setFetchedGeneratedItems] = useState<
    ClosetItem[]
  >([]);
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const dispatch = useAppDispatch();

  const fetchedClosetItems = useAppSelector(
    (state) => state.closetItem.closetItems
  );

  const category = useAppSelector((state) => state.category.category);

  useEffect(() => {
    dispatch(fetchClosetItems(category));
  }, [dispatch]);

  useEffect(() => {
    if (alertMessage) {
      dispatch(
        setToast({ message: alertMessage, type: 'warning', visible: true })
      );
      const timer = setTimeout(() => {
        dispatch(clearToast());
        setAlertMessage('');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage, dispatch]);

  const handleSelectItem = (item: ClosetItem) => {
    setSelectedItem(item);
  };

  const handleAIrequest = async () => {
    setLoading(false);
    if (fetchedClosetItems.length === 0) {
      setAlertMessage(`Save your item category first!`);
      return;
    }

    if (!selectedItem) {
      setAlertMessage('Select an item to be matched!');
      return;
    }

    if (selectedCategoryCheckbox.length === 0) {
      setAlertMessage('Select at least one category!');
      return;
    }

    if (
      Array.isArray(selectedCategoryCheckbox)
        ? selectedCategoryCheckbox.some((item) =>
            selectedCategory.includes(item.toString())
          )
        : selectedCategory.includes(selectedCategoryCheckbox.toString())
    ) {
      setAlertMessage('Select different category from the item!');
      return;
    }

    setLoading(true);
    const userId = localStorage.getItem('uid') || '1';

    const data = {
      userId,
      selectedCategory,
      selectedCategoryCheckbox,
      selectedItem,
    };

    try {
      const result: any = await fetchAIRecommendation(data);
      setExplanation(result.explanation);
      setFetchedGeneratedItems(result['generatedItems']);
      addToRecentlyViewed(result['generatedItems']);
      setCategoryCheckbox([]);
    } catch (error) {
      console.error('Error occurred while fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToRecentlyViewed = async (generatedItems: ClosetItem[]) => {
    if (!selectedItem || generatedItems.length === 0) return;
    const data = {
      userId: localStorage.getItem('uid') || '1',
      selectedItem: selectedItem,
      generatedItems: generatedItems,
    };

    try {
      dispatch(addRecentlyViewedItems(data));
    } catch (err) {
      console.error('Error occurred while adding to recently viewed:', err);
    }
  };

  const handleSaveFavourite = async () => {
    if (!selectedItem || fetchedGeneratedItems.length === 0) return;

    setLoading(true);

    const userId = localStorage.getItem('uid') || '1';

    const data = {
      userId: userId,
      selectedItem: selectedItem,
      generatedItems: fetchedGeneratedItems,
    };

    try {
      dispatch(saveFavouriteItems(data));
    } catch (error) {
      console.error('Error occurred while saving data:', error);
      dispatch(
        setToast({
          message: error as string,
          type: 'error',
          visible: true,
        })
      );
      setTimeout(() => {
        dispatch(clearToast());
      }, 2000);
    } finally {
      dispatch(
        setToast({
          message: 'Succesfully added to Favourite!',
          type: 'success',
          visible: false,
        })
      );
      setTimeout(() => {
        dispatch(clearToast());
      }, 2000);
      setLoading(false);
    }
  };

  const gridClassNames =
    fetchedGeneratedItems.length >= 3
      ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
      : `grid-cols-${fetchedGeneratedItems.length}`;

  return (
    <>
      <div>
        <section>
          <h1 className="text-base text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold mb-6">
            Outfit Suggestion
          </h1>
        </section>
        <div className="flex flex-col lg:flex-row lg:justify-center lg:items-start">
          {/* Heading Section */}

          {/* left container */}
          {/* Dropdown for small screens */}
          <div className="lg:hidden mb-3">
            <Dropdown title="Category" categories={clothingCategory} />
          </div>

          {/* List for larger screens */}
          <ul className="hidden lg:pr-10 md:pr-10 lg:block tracking-tight text-gray-strong">
            {clothingCategory.map((category) => (
              <li
                key={category}
                className={`${
                  selectedCategory === category.toLowerCase()
                    ? 'text-primary'
                    : ''
                } hover:cursor-pointer mr-4 mb-4 text-lg`}
                onClick={() => {
                  if (selectedCategory !== category) {
                    setSelectedCategory(category.toLowerCase());
                    dispatch(fetchClosetItems(category.toLowerCase()));
                  }
                }}
              >
                {category}
              </li>
            ))}
          </ul>

          {/* right container */}
          <div className="">
            <h3 className="text-start mb-3 sm:text-xxs md:text-sm lg:text-lg font-medium text-gray-strong">
              Select the type of clothes to be matched!
            </h3>
            <ItemsGrid
              isInput={true}
              onSelectItem={handleSelectItem}
              wrapCustomClassName="ml-1 sm:ml-3 flex overflow-x-auto gap-2 sm:gap-6 px-1 md:px-2 mx-auto max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-3xl"
              inputClassName={
                'peer text-primary border-gray-light border-2 focus:ring-primary focus:ring-2'
              }
              labelClassName={
                'group-hover:opacity-75 inline-flex items-center border-gray-light border-2 w-full h-full bg-white rounded-lg cursor-pointer overflow-hidden rounded-md relative'
              }
              clothingItems={fetchedClosetItems}
            />
            <h3 className="mb-3 sm:text-xxs md:text-sm lg:text-lg font-medium text-gray-strong">
              Which type of clothing would you like to match?
            </h3>

            {/* Category checkboxes */}
            <div className="flex justify-center">
              <InputGroup
                inputs={categories}
                selected={selectedCategoryCheckbox}
                setSelected={setCategoryCheckbox}
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 sm:gap-y-4 lg:gap-y-5"
              ></InputGroup>
            </div>

            <div className="flex flex-col items-center justify-center">
              <Button
                color="secondary"
                additionalclassname="w-80 m-9"
                onClick={handleAIrequest}
              >
                Get Styled!
              </Button>
              {loading && (
                <div role="status">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-11 h-11 text-gray-light animate-spin fill-primary"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
            </div>
            {fetchedGeneratedItems.length > 0 && !loading && (
              <>
                <h2 className="text-primary">Recommendation for You!</h2>

                <div className="flex flex-col items-center justify-center mt-6 sm:px-6 md:px-8 mx-auto max-w-full sm:max-w-lg md:max-w-1xl lg:max-w-2xl xl:max-w-3xl">
                  <ItemsGrid
                    clothingItems={fetchedGeneratedItems}
                    wrapCustomClassName={`grid ${gridClassNames} gap-2 items-center justify-center`}
                    inputClassName="hidden"
                    labelClassName="group-hover:opacity-75 inline-flex items-center border-gray-light border-2 w-full h-full bg-white rounded-lg overflow-hidden relative"
                    isInput={true}
                  />
                </div>
                {explanation && (
                  <div className="flex flex-col items-center justify-center mt-6 sm:px-6 md:px-8 mx-auto max-w-full sm:max-w-lg md:max-w-1xl lg:max-w-2xl xl:max-w-3xl">
                    <p className="text-center text-gray-strong mb-3 sm:text-xxs md:text-sm lg:text-lg font-medium">
                      {explanation}
                    </p>
                  </div>
                )}
                <div className="flex flex-col items-center justify-center">
                  <Button
                    color="secondary"
                    additionalclassname="w-80 m-9 mb-10"
                    onClick={handleSaveFavourite}
                  >
                    Save to Favourite
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
