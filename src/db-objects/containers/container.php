<?php
/**
 * Container class
 *
 * @package TorroForms
 * @since 1.0.0
 */

namespace awsmug\Torro_Forms\DB_Objects\Containers;

use Leaves_And_Love\Plugin_Lib\DB_Objects\Model;
use Leaves_And_Love\Plugin_Lib\DB_Objects\Traits\Sitewide_Model_Trait;
use awsmug\Torro_Forms\DB_Objects\Forms\Form;
use awsmug\Torro_Forms\DB_Objects\Elements\Element_Collection;
use WP_Error;

/**
 * Class representing a container.
 *
 * @since 1.0.0
 *
 * @property int    $form_id
 * @property string $label
 * @property int    $sort
 *
 * @property-read int $id
 */
class Container extends Model {
	use Sitewide_Model_Trait;

	/**
	 * Container ID.
	 *
	 * @since 1.0.0
	 * @access protected
	 * @var int
	 */
	protected $id = 0;

	/**
	 * ID of the form this container is part of.
	 *
	 * @since 1.0.0
	 * @access protected
	 * @var int
	 */
	protected $form_id = 0;

	/**
	 * Container label.
	 *
	 * @since 1.0.0
	 * @access protected
	 * @var string
	 */
	protected $label = '';

	/**
	 * Index to sort containers by.
	 *
	 * @since 1.0.0
	 * @access protected
	 * @var int
	 */
	protected $sort = 0;

	/**
	 * Returns the parent form for the container.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return Form|null Parent form, or null if none set.
	 */
	public function get_form() {
		if ( empty( $this->form_id ) ) {
			return null;
		}

		return $this->manager->get_parent_manager( 'forms' )->get( $this->form_id );
	}

	/**
	 * Returns all elements that belong to the form.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param array $args Optional. Additional query arguments. Default empty array.
	 * @return awsmug\Torro_Forms\DB_Objects\Elements\Element_Collection List of elements.
	 */
	public function get_elements( $args = array() ) {
		if ( empty( $this->id ) ) {
			return $this->manager->get_child_manager( 'elements' )->get_collection( array(), 0, 'objects' );
		}

		$args = wp_parse_args( $args, array(
			'number'       => -1,
			'container_id' => $this->id,
		) );

		return $this->manager->get_child_manager( 'elements' )->query( $args );
	}

	/**
	 * Deletes the model from the database.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return true|WP_Error True on success, or an error object on failure.
	 */
	public function delete() {
		$elements = $this->get_elements();
		foreach ( $elements as $element ) {
			$element->delete();
		}

		return parent::delete();
	}
}
